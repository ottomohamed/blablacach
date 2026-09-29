export type Country = {
  code: string;
  name: string;
  flag: string;
  cities: string[];
};

export type EuropeanCountry = Country;
export type NorthAfricanCountry = Country;

export type Offer = {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantAvatar: string;
  verified: boolean;
  rating: number;
  totalDeals: number;
  sourceCountry: string;
  sourceFlag: string;
  targetCountry: string;
  targetFlag: string;
  targetCity: string;
  rate: number;
  targetCurrency: string;
  availableAmount: number;
  currency: 'EUR' | 'USD';
  createdAt: string;
  notes?: string;
};

export type DealStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export type Deal = {
  id: string;
  offerId: string;
  merchantId: string;
  merchantName: string;
  senderName: string;
  amount: number;
  currency: 'EUR' | 'USD';
  fee: number;
  rate: number;
  targetCurrency: string;
  targetAmount: number;
  sourceCountry: string;
  targetCountry: string;
  targetCity: string;
  status: DealStatus;
  createdAt: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  deliveryInstructions?: string;
  failReason?: string;
  rated: boolean;
  buyerRated: boolean;
  sellerRated: boolean;
  buyerRating?: number;
  buyerComment?: string;
};

export type ReviewType = 'seller' | 'buyer';

export type Review = {
  id: string;
  dealId: string;
  merchantId: string;
  rating: number;
  comment: string;
  author: string;
  createdAt: string;
  reviewType: ReviewType;
  targetId: string;
  targetName: string;
};

export type SearchFilters = {
  sourceCountry?: string;
  targetCountry?: string;
  targetCity?: string;
  amount?: string;
  currency?: 'EUR' | 'USD';
};

export const EUROPEAN_COUNTRIES: EuropeanCountry[] = [
  {
    code: 'ES', name: 'Spain', flag: '🇪🇸',
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Málaga', 'Zaragoza', 'Murcia', 'Palma', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'Granada', 'Vitoria', 'Oviedo', 'Santa Cruz de Tenerife', 'Las Palmas', 'Hospitalet', 'A Coruña', 'Vitoria-Gasteiz', 'Elche', 'Badalona', 'Cartagena', 'Terrassa', 'Jerez de la Frontera', 'Sabadell', 'Móstoles', 'Alcalá de Henares', 'Pamplona', 'Fuenlabrada', 'Almería', 'Leganés', 'San Sebastián', 'Getafe', 'Burgos', 'Santander', 'Albacete', 'Algeciras', 'Logroño', 'Salamanca', 'Cádiz', 'Huelva', 'Marbella', 'Lleida', 'Tarragona', 'León', 'Castellón', 'Dos Hermanas', 'Parla', 'Talavera', 'Almería', 'Girona', 'Toledo', 'Albacete', 'Jaén', 'Ourense', 'Badajoz', 'Cáceres', 'Lugo', 'Cuenca', 'Teruel', 'Soria', 'Segovia', 'Ávila', 'Palencia', 'Zamora', 'Guadalajara', 'Ceuta', 'Melilla'],
  },
  {
    code: 'FR', name: 'France', flag: '🇫🇷',
    cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Lille', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 'Le Mans', 'Aix-en-Provence', 'Brest', 'Tours', 'Amiens', 'Limoges', 'Annecy', 'Perpignan', 'Boulogne-Billancourt', 'Metz', 'Orléans', 'Saint-Denis', 'Rouen', 'Argenteuil', 'Mulhouse', 'Saint-Paul', 'Caen', 'Nancy', 'Tourcoing', 'Roubaix', 'Avignon', 'Vitry-sur-Seine', 'Créteil', 'Dunkerque', 'Poitiers', 'Asnières-sur-Seine', 'Versailles', 'Courbevoie', 'Colombes', 'Aubervilliers', 'Aulnay-sous-Bois', 'Cherbourg', 'Pau', 'La Rochelle', 'Cannes', 'Saint-Nazaire', 'Bourges', 'Béziers', 'Valence', 'Quimper', 'La Seyne-sur-Mer', 'Évry', 'Laval', 'Nanterre', 'Troyes', 'Antibes', 'Belfort', 'Cholet', 'Vannes', 'Carcassonne', 'Niort', 'Saint-Brieuc', 'Chambéry', 'Bastia', 'Sète', 'Albi', 'Arras', 'Angoulême', 'La Roche-sur-Yon', 'Blois', 'Saint-Quentin', 'Clermont-Ferrand', 'Ajaccio', 'Calais', 'Douai', 'Châteauroux', 'Bourg-en-Bresse', 'Narbonne', 'Tarbes', 'Lorient', 'Montélimar', 'Lens', 'Thionville', 'Boulogne-sur-Mer', 'Martigues', 'Nevers', 'Brive-la-Gaillarde', 'Saint-Dizier', 'Carcans', 'Nîmes', 'Dax', 'Mâcon', 'Vichy', 'Charleville-Mézières', 'Auch', 'Cahors', 'Rodez', 'Foix', 'Mende', 'Privilège'],
  },
  {
    code: 'IT', name: 'Italy', flag: '🇮🇹',
    cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Bologna', 'Florence', 'Bari', 'Catania', 'Venice', 'Verona', 'Genoa', 'Messina', 'Padua', 'Trieste', 'Brescia', 'Parma', 'Prato', 'Taranto', 'Modena', 'Reggio Calabria', 'Reggio Emilia', 'Perugia', 'Livorno', 'Ravenna', 'Cagliari', 'Foggia', 'Rimini', 'Salerno', 'Ferrara', 'Sassari', 'Latina', 'Giugliano', 'Monza', 'Siracusa', 'Pescara', 'Bergamo', 'Forlì', 'Trento', 'Vicenza', 'Terni', 'Bolzano', 'Novara', 'Pisa', 'Ancona', 'Andria', 'Arezzo', 'Udine', 'Cesena', 'Lecce', 'Pesaro', 'Barletta', 'Alessandria', 'La Spezia', 'Pistoia', 'Piacenza', 'Lucca', 'Guidonia', 'Catanzaro', 'Cremona', 'Treviso', 'Brindisi', 'Torre del Greco', 'Savona', 'Grosseto', 'Siena', 'Lamezia Terme', 'Altamura', 'Potenza', 'Pisa', 'Lucca', 'Trani', 'Cosenza', 'Crotone', 'Viterbo', "L'Aquila", 'Campobasso', 'Isernia', 'Enna', 'Ragusa', 'Sassari', 'Olbia', 'Nuoro', 'Oristano', 'Aosta', 'Matera', 'Bolzano'],
  },
  {
    code: 'DE', name: 'Germany', flag: '🇩🇪',
    cities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hanover', 'Nuremberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster', 'Karlsruhe', 'Mannheim', 'Augsburg', 'Wiesbaden', 'Gelsenkirchen', 'Mönchengladbach', 'Braunschweig', 'Chemnitz', 'Kiel', 'Aachen', 'Halle', 'Magdeburg', 'Freiburg', 'Krefeld', 'Lübeck', 'Oberhausen', 'Erfurt', 'Mainz', 'Rostock', 'Kassel', 'Hagen', 'Hamm', 'Saarbrücken', 'Mülheim', 'Herne', 'Ludwigshafen', 'Osnabrück', 'Oldenburg', 'Leverkusen', 'Solingen', 'Potsdam', 'Neuss', 'Heidelberg', 'Paderborn', 'Darmstadt', 'Regensburg', 'Würzburg', 'Ingolstadt', 'Heilbronn', 'Ulm', 'Wolfsburg', 'Göttingen', 'Offenbach', 'Recklinghausen', 'Pforzheim', 'Bottrop', 'Reutlingen', 'Fürth', 'Bremerhaven', 'Recklinghausen', 'Koblenz', 'Bergisch Gladbach', 'Erlangen', 'Moers', 'Trier', 'Jena', 'Siegen', 'Hildesheim', 'Salzgitter', 'Cottbus', 'Gera'],
  },
  {
    code: 'BE', name: 'Belgium', flag: '🇧🇪',
    cities: ['Brussels', 'Antwerp', 'Ghent', 'Liège', 'Bruges', 'Charleroi', 'Leuven', 'Namur', 'Mons', 'Aalst', 'Mechelen', 'La Louvière', 'Kortrijk', 'Hasselt', 'Ostend', 'Tournai', 'Genk', 'Seraing', 'Roeselare', 'Verviers', 'Mouscron', 'Beveren', 'Beringen', 'Dendermonde', 'Heist-op-den-Berg', 'Sint-Niklaas', 'Lokeren', 'Turnhout', 'Dilbeek', 'Heusden-Zolder', 'Izegem', 'Geel', 'Lier', 'Ypres', 'Tielt', 'Wavre', 'Arlon', 'Bastogne', 'Ath', 'Soignies', 'Dinant', 'Huy', 'Ciney', 'Marche-en-Famenne', 'Neufchâteau', 'Virton', 'Eupen', 'Sankt Vith', 'Veurne', 'Diksmuide', 'Ieper', 'Komen', 'Menen', 'Deinze', 'Lochristi', 'Lokeren', 'Zottegem', 'Ronse', 'Oudenaarde', 'Ninove', 'Aalst', 'Floreffe', 'Fleurus', 'Châtelet', 'Farciennes', 'Fosses-la-Ville', 'Gembloux'],
  },
  {
    code: 'NL', name: 'Netherlands', flag: '🇳🇱',
    cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen', 'Enschede', 'Apeldoorn', 'Haarlem', 'Arnhem', 'Amersfoort', 'Zaanstad', "'s-Hertogenbosch", 'Haarlemmermeer', 'Zwolle', 'Zoetermeer', 'Leeuwarden', 'Leiden', 'Maastricht', 'Dordrecht', 'Ede', 'Alphen aan den Rijn', 'Alkmaar', 'Emmen', 'Delft', 'Leidschendam-Voorburg', 'Purmerend', 'Oss', 'Heerlen', 'Westland', 'Spijkenisse', 'Deventer', 'Hilversum', 'Amstelveen', 'Capelle aan den IJssel', 'Helmond', 'Houten', 'Velsen', 'Gouda', 'Lelystad', 'Nieuwegein', 'Veenendaal', 'Roosendaal', 'Schiedam', 'Bergen op Zoom', 'Venlo', 'Koog aan de Zaan', 'Weert', 'Vlissingen', 'Zierikzee', 'Goes', 'Middelburg', 'Harderwijk', 'Kampen', 'Doetinchem', 'Harderwijk', 'Steenwijk', 'Dronten', 'Borne', 'Culemborg', 'Tiel', 'Woerden', 'Maassluis', 'Ridderkerk', 'Hoorn', 'Vlaardingen', 'Katwijk', 'Hengelo', 'Zaltbommel'],
  },
  {
    code: 'CH', name: 'Switzerland', flag: '🇨🇭',
    cities: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel', 'Thun', 'Köniz', 'La Chaux-de-Fonds', 'Fribourg', 'Schaffhausen', 'Vernier', 'Chur', 'Neuchâtel', 'Uster', 'Sion', 'Emmen', 'Zug', 'Yverdon-les-Bains', 'Kriens', 'Rapperswil-Jona', 'Dübendorf', 'Dietikon', 'Montreux', 'Frauenfeld', 'Vevey', 'Wohlen', 'Wil', 'Carouge', 'Meyrin', 'Bulle', 'Renens', 'Nyon', 'Prilly', 'Gossau', 'Aarau', 'Bellinzona', 'Kreuzlingen', 'Baden', 'Basel', 'Lancy', 'Onex', 'Monthey', 'Morges', 'Bülach', 'Thalwil', 'Uster', 'Horw', 'Solothurn', 'Kloten', 'Adliswil', 'Steffisburg', 'Wettingen', 'Opfikon', 'Münsingen', 'Illnau-Effretikon', 'Gossau', 'Weinfelden', 'Olten', 'Langenthal'],
  },
  {
    code: 'PT', name: 'Portugal', flag: '🇵🇹',
    cities: ['Lisbon', 'Porto', 'Braga', 'Faro', 'Coimbra', 'Aveiro', 'Évora', 'Funchal', 'Leiria', 'Viseu', 'Setúbal', 'Viana do Castelo', 'Castelo Branco', 'Guarda', 'Portimão', 'Almada', 'Sintra', 'Vila Nova de Gaia', 'Loures', 'Cascais', 'Odivelas', 'Amadora', 'Oeiras', 'Maia', 'Matosinhos', 'Albufeira', 'Loulé', 'Torres Vedras', 'Beja', 'Portalegre', 'Ponta Delgada', 'Angra do Heroísmo', 'Horta', 'Tomar', 'Vila Real', 'Bragança', 'Caldas da Rainha', 'Marinha Grande', 'Figueira da Foz', 'Barcelos', 'Guimarães', 'Ílhavo', 'Seixal', 'Alcobaça', 'Torres Novas', 'Santarém', 'Póvoa de Varzim', 'Vila Franca de Xira', 'Lagos', 'Tavira', 'Silves', 'Alcácer do Sal', 'Sines', 'Grândola', 'Serpa', 'Odemira', 'Ourique', 'Castro Verde', 'Almodôvar', 'Moura', 'Cuba', 'Vidigueira', 'Portel', 'Borba', 'Estremoz', 'Montemor', 'Vendas Novas', 'Campo Maior', 'Elvas', 'Arronches', 'Monforte', 'Ponte de Sôr', 'Avis', 'Sousel', 'Crato', 'Gavião', 'Nisa', 'Marvão'],
  },
];

export const NORTH_AFRICAN_COUNTRIES: NorthAfricanCountry[] = [
  {
    code: 'MA', name: 'Morocco', flag: '🇲🇦',
    cities: ['Casablanca', 'Rabat', 'Marrakech', 'Fez', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan', 'Salé', 'Nador', 'Mohammedia', 'El Jadida', 'Béni Mellal', 'Safi', 'Khouribga', 'Settat', 'Taza', 'Essaouira', 'Larache', 'Berkane', 'Ksar El Kebir', 'Guelmim', 'Dakhla', 'Laâyoune', 'Ifrane', 'Errachidia', 'Ouarzazate', 'Taroudant', 'Tiznit', 'Inezgane', 'Khenifra', 'Sidi Slimane', 'Sidi Kacem', 'Sefrou', 'Figuig', 'Tinghir', 'Oued Zem', 'Berrechid', 'Sidi Yahya El Gharb', 'Fquih Ben Salah', 'Taourirt', 'Midelt', 'Azrou', 'Chefchaouen', 'Al Hoceima', 'Imintanout', 'Taliouine', 'Tarfaya', 'Tan-Tan', 'Boujdour', 'Smara', 'Es-Semara', 'Jerada', 'Guercif', 'Zagora', 'Tissint', 'Oualidia', 'Kerrouchen', 'Tighassaline', 'Tinejdad', 'Skhour Rehamna', 'Sidi Rahhal', 'Ait Ourir', 'Amizmiz', 'Tahanaout', 'Asni', 'Oukaïmeden', 'Taliouine', 'Foum Jamaa', 'Souk El Arba', 'Targuist', 'Karia', 'Ketama', 'Issaguen', 'Targuist', 'Karia', 'Zeghanghane', 'Sidi Ifni', 'Guelmim', 'Fam El Hisn', 'Akka', 'Tata', 'Tissint', 'Akhfennir', 'Taghijacht', 'Tighza', 'Anergui', 'Tilmi', 'Aït Hani', 'Tounfite', 'Imilchil', 'Tarmigt', 'Asfalou', 'Tamdakht', 'Armd', 'Amezrou', 'Ouled Teima', 'Lqliâa', 'Tikiouine', 'Souihla', 'Aït Melloul', 'Dcheira', 'Inezgane', 'Ait Baha', 'Tafraout', 'Mirleft', 'Legzira', 'Sidi Bibi', 'Massa', 'Aouifat', 'Bouizakarne', 'Lakhiait', 'Fask', 'Oued Ed-Dahab', 'Bir Anzarane', 'Mijik', 'Lemgayser', 'El Marsa', 'Jraifia', 'Aousserd', 'Lagouira'],
  },
  {
    code: 'DZ', name: 'Algeria', flag: '🇩🇿',
    cities: ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Sétif', 'Sidi Bel Abbès', 'Biskra', 'Tiaret', 'Béjaïa', 'Tébessa', 'Tlemcen', 'Ouargla', 'Skikda', 'Béchar', 'Laghouat', 'Bouira', 'Tizi Ouzou', 'Mostaganem', 'Bordj Bou Arréridj', 'Médéa', 'Chlef', 'Aïn Defla', 'Jijel', 'Saïda', 'Relizane', 'Mascara', 'Souk Ahras', 'Mila', 'Guelma', 'El Oued', 'Khenchela', 'M\'Sila', 'Boumerdès', 'Tamanrasset', 'Adrar', 'Tindouf', 'El Bayadh', 'Illizi', 'Bordj Badji Mokhtar', 'Timimoun', 'In Salah', 'In Guezzam', 'Oum El Bouaghi', 'El Tarf', 'Tipaza', 'Aïn Témouchent', 'Naâma', 'El M\'Ghair', 'Touggourt', 'Djamaa', 'Ksar Chellala', 'Theniet El Had', 'Aflou', 'Colomb-Béchar', 'Hassi Bahbah', 'Sour El Ghozlane', 'Bordj Menaiel', 'Ammi Moussa', 'Oued Rhiou', 'Djidiouia', 'Mazouna', 'El Amria', 'Arzew', 'Bethioua', 'Aïn El Turk', 'Gdyel', 'Bou Sfer', 'Oued Tlelat', 'Sidi Ali', 'Hassi Ben Abdellah', 'Bou Hanifia', 'Hammam Bou Hadjar', 'El Abadia', 'Aïn Kechra', 'Ouled Djellal', 'Sidi Okba', 'Tolga', 'Biskra', 'Ouled Djellal', 'Sidi Khaled', 'Doucen', 'Aïn Naga', 'Mchouneche', 'El Kantara', 'Zeribet El Oued', 'El Outaya', 'Foughala', 'M\'Rara', 'Sidi Amrane', 'Still', 'Debila', 'Robbah', 'Guemar', 'Kouinine', 'Bayadha', 'Nakhla', 'Taleb Larbi', 'El Mgheir', 'Sidi Aoun', 'Reguiba', 'Hamraia'],
  },
  {
    code: 'MR', name: 'Mauritania', flag: '🇲🇷',
    cities: ['Nouakchott', 'Nouadhibou', 'Rosso', 'Kaédi', 'Zouérat', 'Atar', 'Néma', 'Sélibaby', 'Akjoujt', 'Aleg', 'Boutilimit', 'Tidjikja', 'Tichit', 'Boghé', 'Kiffa', 'Monguel', 'Guérou', 'Rkiz', 'Bareina', 'Keur Massène', 'Tekane', 'Dar-Naim', 'Sebkha', 'Tavragh Zeina', 'Ksar', 'Teyarett', 'El Mina', 'Arafat', 'Riyadh', 'Lexeiba', 'Boumdeid', 'Guerou', 'Hamod', 'Maghama', 'Mbagne', 'Bababé', 'Kankossa', 'Foum Gleita', 'Ghabou', 'N\'Beika', 'Tamchekett', 'Moudjeria', 'Lekhwaar', 'Boulanoir', 'Aoujeft', 'Chinguetti', 'Ouadane', 'Legrane', 'Boulenouar', 'Inal', 'Lekouar', 'Chami', 'Boumdeid', 'Boutilimit', 'Mederdra', 'Guerou', 'Sanghreffa', 'Ghabou', 'Bareina', 'Mbagne', 'Monguel', 'Bababé', 'Senossa', 'Djéol', 'Wompou', 'Bassikounou', 'Aghor', 'Bousteila', 'Kiffa', 'Tamdint', 'Ghourlane', 'Tamchakett', 'Tidjikja', 'Rachid', 'Moudjeria', 'Aoujeft', 'Lekhwaar', 'N\'Beika', 'Tichit', 'Legrane', 'Ouadane', 'Chinguetti', 'Atar', 'Akjoujt', 'Zouérat', 'F\'Derik', 'Bir Moghrein', 'Lemsid', 'Bou Lanouar', 'Labbott', 'Cansado', 'Nouadhibou'],
  },
  {
    code: 'TN', name: 'Tunisia', flag: '🇹🇳',
    cities: ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana', 'Gafsa', 'Monastir', 'Ben Arous', 'La Marsa', 'Kasserine', 'Médenine', 'Tataouine', 'Le Kef', 'Mahdia', 'Nabeul', 'Hammamet', 'Sidi Bouzid', 'Jendouba', 'Béja', 'Siliana', 'Kebili', 'Tozeur', 'Zaghouan', 'Manouba', 'Djerba', 'Métouia', 'El Jem', 'Mahares', 'Chebba', 'Kerkennah', 'Houmt Souk', 'Midoun', 'Ajim', 'Tabarka', 'Ain Draham', 'Fernana', 'Tajerouine', 'Nebeur', 'Ghardimaou', 'Maktar', 'Rouhia', 'Bou Salem', 'Téboursouk', 'Remada', 'Dehiba', 'Matmata', 'Douz', 'Bechini', 'El Hamma', 'Mareth', 'Zarzis', 'Ben Gardane', 'Teboulba', 'Msaken', 'Kalaat el Andalous', 'Menzel Bourguiba', 'Menzel Jemil', 'Cap Serrat', 'Raf Raf', 'Ghar El Melh', 'La Goulette', 'Carthage', 'Sidi Daoud', 'El Fahs', 'Djebel Oust', 'Zaghouan', 'Bir El Kassaa', 'Hammam Sousse', 'Enfidha', 'Kelibia', 'El Haouaria', 'Korba', 'Menzel Temime', 'Kélibia', 'Soliman', 'Grombalia', 'Mreziga', 'Korba', 'Tazerka', 'Menzel Bouzelfa', 'Bouficha', 'Sidi Bou Said', 'Marsa', 'Gammarth', 'Les Berges du Lac', 'Sidi Thabet', 'El Menzah', 'El Ouardia', 'Ezzahra', 'Radès', 'Mégrine', 'Hammam Lif', 'Borj Cedria', 'Fouchana', 'Mohamedia', 'Mornag', 'Soliman'],
  },
  {
    code: 'LY', name: 'Libya', flag: '🇱🇾',
    cities: ['Tripoli', 'Benghazi', 'Misrata', 'Zawiya', 'Zliten', 'Ajdabiya', 'Sirte', 'Sabha', 'Tobruk', 'Derna', 'Ghadames', 'Ghat', 'Murzuq', 'Bani Walid', 'Khoms', 'Bayda', 'Marj', 'Shahhat', 'Suluq', 'Tajura', 'Suq al-Jum\'a', 'Tarhuna', 'Janzour', 'Zuwara', 'Sabratha', 'Surman', 'Msallata', 'Qasr Bu Hadi', 'Sunayz', 'Ras Lanuf', 'Brega', 'Jalu', 'Awjila', 'Kufra', 'Tazerbo', 'Rebyana', 'Waddan', 'Hun', 'Sokna', 'Brak', 'Qatron', 'Tmassan', 'Barkat', 'Ash-Shati', 'Idri', 'Faqar', 'Jufra', 'Wadi al-Ahmar', 'Al Khums', 'Al Jawf', 'Ubari', 'Sebha', 'Murzuk', 'Qatrun', 'Tajheri', 'Al Qubah', 'Al Bayda', 'Shahat', 'Susa', 'Ras al Hilal', 'Derna', 'Martuba', 'Battah', 'Tobruk', 'Jaghbub', 'Marsa Matruh'],
  },
];

export const EXCHANGE_RATES = [
  { source: 'Spain', sourceFlag: '🇪🇸', target: 'Morocco', targetFlag: '🇲🇦', rate: 11.2, currency: 'MAD' },
  { source: 'France', sourceFlag: '🇫🇷', target: 'Algeria', targetFlag: '🇩🇿', rate: 265, currency: 'DZD' },
  { source: 'Belgium', sourceFlag: '🇧🇪', target: 'Mauritania', targetFlag: '🇲🇷', rate: 42, currency: 'MRU' },
  { source: 'Italy', sourceFlag: '🇮🇹', target: 'Tunisia', targetFlag: '🇹🇳', rate: 3.4, currency: 'TND' },
  { source: 'Germany', sourceFlag: '🇩🇪', target: 'Morocco', targetFlag: '🇲🇦', rate: 11.15, currency: 'MAD' },
  { source: 'France', sourceFlag: '🇫🇷', target: 'Morocco', targetFlag: '🇲🇦', rate: 11.25, currency: 'MAD' },
  { source: 'Netherlands', sourceFlag: '🇳🇱', target: 'Algeria', targetFlag: '🇩🇿', rate: 263, currency: 'DZD' },
  { source: 'Spain', sourceFlag: '🇪🇸', target: 'Tunisia', targetFlag: '🇹🇳', rate: 3.38, currency: 'TND' },
  { source: 'Italy', sourceFlag: '🇮🇹', target: 'Morocco', targetFlag: '🇲🇦', rate: 11.18, currency: 'MAD' },
  { source: 'Germany', sourceFlag: '🇩🇪', target: 'Libya', targetFlag: '🇱🇾', rate: 5.35, currency: 'LYD' },
  { source: 'France', sourceFlag: '🇫🇷', target: 'Tunisia', targetFlag: '🇹🇳', rate: 3.42, currency: 'TND' },
  { source: 'Spain', sourceFlag: '🇪🇸', target: 'Algeria', targetFlag: '🇩🇿', rate: 264, currency: 'DZD' },
];

export const FAIL_REASONS = [
  'Merchant did not respond',
  'Rate changed at the last minute',
  'Amount no longer available',
  'Could not agree on meeting point',
  'Payment method mismatch',
  'Other',
];
