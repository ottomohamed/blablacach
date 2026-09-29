-- Credits system: users buy credits via Stripe, spend them to reveal phone numbers

CREATE TABLE IF NOT EXISTS user_credits (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null unique,
  balance integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_credits" ON user_credits FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE via API: credits are managed server-side only
-- The webhook adds credits, edge functions deduct them

CREATE TABLE IF NOT EXISTS credit_transactions (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null,
  amount integer not null,
  type text not null check (type in ('purchase', 'spend', 'refund')),
  description text,
  stripe_order_id bigint references stripe_orders(id),
  created_at timestamp with time zone default now()
);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_transactions" ON credit_transactions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- SECURITY DEFINER function to add credits (called by webhook)
CREATE OR REPLACE FUNCTION add_user_credits(p_user_id uuid, p_amount integer, p_description text, p_order_id bigint default null)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_credits (user_id, balance)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET balance = user_credits.balance + p_amount, updated_at = now();

  INSERT INTO credit_transactions (user_id, amount, type, description, stripe_order_id)
  VALUES (p_user_id, p_amount, 'purchase', p_description, p_order_id);
END;
$$;

-- SECURITY DEFINER function to deduct credits for phone reveal
CREATE OR REPLACE FUNCTION spend_credits(p_user_id uuid, p_amount integer, p_description text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance integer;
BEGIN
  SELECT balance INTO current_balance FROM user_credits WHERE user_id = p_user_id FOR UPDATE;
  IF current_balance IS NULL OR current_balance < p_amount THEN
    RETURN false;
  END IF;

  UPDATE user_credits SET balance = balance - p_amount, updated_at = now() WHERE user_id = p_user_id;
  INSERT INTO credit_transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_amount, 'spend', p_description);

  RETURN true;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION add_user_credits TO authenticated;
GRANT EXECUTE ON FUNCTION spend_credits TO authenticated;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
