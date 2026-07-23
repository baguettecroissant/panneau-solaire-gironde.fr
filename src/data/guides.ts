export interface GuideSection {
	heading: string;
	paragraphs: string[];
	bullets?: string[];
}

export interface Guide {
	slug: string;
	title: string;
	shortTitle: string;
	description: string;
	category: string;
	readTime: string;
	image: string;
	path?: string;
	intro: string;
	sections: GuideSection[];
	faqs: Array<[string, string]>;
}

export const guides: Guide[] = [
	{
		slug: 'prix-panneaux-solaires-gironde-2026',
		title: 'Prix des panneaux solaires en Gironde en 2026 : comparatif 3, 6 et 9 kWc',
		shortTitle: 'Prix 3, 6 et 9 kWc dans le 33',
		description: 'Prix 2026 d’une installation solaire en Gironde : comparaison 3, 6 et 9 kWc, production, équipements et rentabilité.',
		category: 'Prix',
		readTime: '8 min',
		image: '/images/guide-prix-gironde.png',
		intro: 'Le prix utile n’est jamais celui d’un panneau isolé. Il faut comparer une centrale livrée, raccordée et documentée : modules, électronique de puissance, système de fixation, protections électriques, accès au suivi, démarches et garanties. En Gironde, l’ensoleillement est favorable, mais il ne compense ni une toiture mal étudiée ni une puissance choisie uniquement pour remplir le pan disponible. Les fourchettes ci-dessous sont des repères de marché, à confirmer par des devis datés et comparables.',
		sections: [
			{
				heading: '3, 6 ou 9 kWc : partir des usages, pas de la surface',
				paragraphs: [
					'Un projet de 3 kWc répond souvent à une maison sobre, chauffée autrement qu’à l’électricité, avec une présence en journée ou quelques appareils programmables. En configuration simple, une enveloppe indicative de 7 000 à 9 500 € TTC permet de situer les devis, sans constituer un tarif officiel. La surface nécessaire dépend de la puissance unitaire des modules et de leur calepinage.',
					'Une installation de 6 kWc devient cohérente avec une famille équipée, une piscine, une pompe à chaleur, une climatisation ou une recharge de véhicule pilotée. Une enveloppe de 12 000 à 16 000 € TTC est un ordre de grandeur, tandis que 9 kWc peut se situer autour de 16 000 à 22 000 € TTC. Une charpente complexe, un accès difficile, une reprise électrique ou un stockage font varier ces repères.'
				],
				bullets: [
					'3 kWc : petit talon de consommation et usages diurnes limités.',
					'6 kWc : besoins plus soutenus et plusieurs charges pilotables.',
					'9 kWc : consommation importante, surface disponible et injection à étudier.'
				]
			},
			{
				heading: 'Transformer les kWc en kWh réellement utiles',
				paragraphs: [
					'Sur les 140 centres communaux calculés pour ce site, PVGIS 5.3 projette environ 1 245 à 1 342 kWh par kWc et par an pour 1 kWc, 14 % de pertes système et des angles optimisés. Six kWc représenteraient donc environ 7 470 à 8 052 kWh/an dans ces hypothèses. Ce n’est pas une promesse : pente, azimut, ombres, température, pertes électriques et indisponibilités doivent être modélisés sur la toiture.',
					'L’exemple devient économique seulement après séparation des kWh autoconsommés et injectés. Si le foyer consomme peu à midi, une forte production annuelle peut générer beaucoup de surplus. Demandez une simulation mensuelle, idéalement horaire, fondée sur vos factures et vos futurs usages, avec le logiciel, les pertes et le profil de consommation documentés.'
				]
			},
			{
				heading: 'Les postes qui font légitimement varier le devis',
				paragraphs: [
					'La couverture pèse davantage que l’esthétique du module. Les tuiles canal courantes autour de Bordeaux réclament des fixations compatibles, un cheminement prudent et parfois le remplacement d’éléments fragiles. La hauteur, l’échafaudage, l’accès, la distance jusqu’au tableau, la mise à la terre et l’état de l’installation électrique modifient la main-d’œuvre. Une visite technique doit précéder tout engagement définitif.',
					'Les ombres et les orientations multiples peuvent justifier des micro-onduleurs ou des optimiseurs, sans corriger une mauvaise implantation. Un onduleur central reste pertinent sur un champ homogène. Comparez coût installé, garantie, remplacement et accès aux données plutôt qu’une technologie présentée comme universellement supérieure.'
				]
			},
			{
				heading: 'Ce que le prix annoncé doit réellement inclure',
				paragraphs: [
					'Le devis doit nommer les références exactes, les quantités, la puissance totale, la fixation, les protections côté courant continu et alternatif, la supervision, les câbles et le traitement des traversées. Il doit aussi préciser les démarches incluses : déclaration préalable, raccordement, Consuel lorsque requis, contrat de vente du surplus et mise en service. Une mention vague telle que « kit premium » ne permet aucune comparaison.',
					'Vérifiez échafaudage, évacuation, tuiles de remplacement, remise en état et formation au suivi. Les garanties produit, performance et main-d’œuvre sont distinctes. La décennale doit couvrir l’activité photovoltaïque à la date du chantier, avec une raison sociale identique à celle du devis.'
				],
				bullets: [
					'Prix TTC, taux de TVA justifié et calendrier de paiement.',
					'Puissance, marques, modèles et garanties de chaque composant.',
					'Démarches administratives, raccordement et réception détaillés.',
					'Hypothèses de production et limites de la simulation.'
				]
			},
			{
				heading: 'Batterie, financement et options : recalculer séparément',
				paragraphs: [
					'Une batterie de 5 à 10 kWh peut ajouter plusieurs milliers d’euros. Son devis doit isoler capacité utile, puissance, rendement, fonction de secours éventuelle et matériel de commutation. Comparez son coût au nombre de kWh de surplus qu’elle pourra réellement déplacer chaque année. Il est souvent plus prudent d’optimiser d’abord le chauffe-eau, la piscine ou la recharge, puis d’observer une saison complète.',
					'Un financement allonge parfois la durée de remboursement au-delà du retour technique attendu. Calculez le coût total avec intérêts et assurance, puis comparez-le au prix comptant. Refusez une mensualité présentée comme « remplacée par les économies » sans tableau de flux. Les aides, primes ou recettes ne doivent pas être garanties par le vendeur : leurs conditions et montants se vérifient sur les sources officielles au jour du devis.',
					'Faites enfin chiffrer séparément les options de domotique, d’extension de garantie et de maintenance. Une ligne isolée peut être supprimée ou comparée ; un forfait global rend impossible l’arbitrage entre confort, sécurité et rendement financier.'
				]
			},
			{
				heading: 'Comparer trois offres sans comparer trois slogans',
				paragraphs: [
					'Ramenez chaque proposition au même périmètre : puissance installée, production prudente, part autoconsommée, durée d’étude, composants, démarches et service après-vente. Le prix par kWc est un filtre, pas une décision, car il ignore la qualité de pose et la pertinence du dimensionnement. Demandez au professionnel d’expliquer les écarts plutôt que de négocier immédiatement une remise.'
				],
				bullets: [
					'Comparer au moins deux scénarios de puissance, pas seulement deux marques.',
					'Faire chiffrer explicitement les travaux électriques ou de couverture.',
					'Conserver une version datée du devis et de l’étude de production.',
					'Ne jamais signer sous prétexte de perdre une aide le soir même.'
				]
			}
		],
		faqs: [
			['Quel budget retenir pour 6 kWc à Bordeaux ?', 'Pour une toiture simple, 12 000 à 16 000 € TTC constitue un repère indicatif, pas un barème. L’accès, la couverture, l’électronique, les protections et les démarches peuvent déplacer cette fourchette. Comparez des devis après visite avec un périmètre identique.'],
			['Le prix au watt-crête suffit-il pour choisir ?', 'Non. Il facilite un premier tri, mais ne valorise ni le dimensionnement, ni l’étanchéité, ni la qualité électrique, ni le suivi après-vente. Un prix bas par watt peut aussi provenir d’une puissance excessive par rapport aux besoins.'],
			['Une batterie doit-elle être incluse dès le premier devis ?', 'Seulement si le profil du soir et le surplus prévu la justifient. Demandez un scénario sans batterie, un scénario avec stockage et le coût complet du kWh déplacé. Une architecture compatible avec un ajout ultérieur peut préserver la décision.']
		]
	},
	{
		slug: 'autoconsommation-solaire-bordeaux',
		title: 'Autoconsommation solaire à Bordeaux : une décision rationnelle et mesurable',
		shortTitle: 'Autoconsommation à Bordeaux',
		description: 'Comprendre et optimiser l’autoconsommation solaire à Bordeaux : taux de couverture, pilotage, surplus, batterie et dimensionnement.',
		category: 'Autoconsommation',
		readTime: '8 min',
		image: '/images/guide-autoconsommation-bordeaux.png',
		intro: 'À Bordeaux, une installation photovoltaïque produit surtout entre la fin de matinée et l’après-midi, avec un profil saisonnier marqué. L’objectif n’est donc pas de battre un record annuel, mais de faire coïncider la production avec des besoins utiles. Cette démarche commence par deux indicateurs correctement distingués, se poursuit par un dimensionnement mesuré et s’améliore souvent davantage grâce au pilotage qu’avec une batterie achetée trop tôt.',
		sections: [
			{
				heading: 'Autoconsommation et autonomie ne racontent pas la même chose',
				paragraphs: [
					'Le taux d’autoconsommation est la part de la production solaire utilisée dans le logement. Le taux d’autonomie est la part de la consommation totale couverte par cette production. Une petite centrale peut autoconsommer presque tout ce qu’elle produit tout en couvrant une fraction modeste des besoins. À l’inverse, une grande centrale peut améliorer l’autonomie annuelle tout en injectant beaucoup à midi.',
					'Exemple illustratif : une maison consomme 6 000 kWh par an et la centrale produit 4 000 kWh. Si 2 200 kWh sont utilisés sur place, l’autoconsommation atteint 55 % et l’autonomie environ 37 %. Ces ratios servent à comprendre les flux, pas à prouver seuls la rentabilité.'
				]
			},
			{
				heading: 'Lire la courbe de charge avant de choisir la puissance',
				paragraphs: [
					'Les factures mensuelles donnent le volume, mais pas l’heure des usages. Un relevé de compteur communicant, utilisé avec l’accord du titulaire, montre le talon permanent, les pointes du matin et du soir ainsi que les consommations estivales. Une semaine n’est pas représentative : chauffage, climatisation, piscine et absences changent le profil au fil des saisons.'
				],
				bullets: [
					'Relever le talon de consommation entre 11 h et 16 h.',
					'Identifier les usages déplaçables et leur durée réelle.',
					'Séparer hiver, intersaison, été et périodes d’absence.',
					'Noter les équipements futurs sans les considérer comme certains.'
				]
			},
			{
				heading: 'Un exemple de dimensionnement sans fausse précision',
				paragraphs: [
					'Supposons une maison bordelaise consommant 7 000 kWh par an, dont piscine et eau chaude peuvent être pilotées. Tester 3, 6 et 9 kWc permet de voir à quel moment le surplus progresse plus vite que l’autonomie. L’étude doit appliquer à chaque scénario la même orientation, les mêmes pertes et la même courbe de charge afin que la comparaison reste honnête.',
					'Le meilleur choix ne couvre pas forcément le plus grand pourcentage annuel. Une centrale de 6 kWc peut alimenter régulièrement les usages diurnes quand 9 kWc injecterait beaucoup sans besoin futur crédible. Les résultats mensuels révèlent les excédents d’été et les achats d’hiver masqués par la moyenne annuelle.'
				]
			},
			{
				heading: 'Piloter les usages dans le bon ordre',
				paragraphs: [
					'Commencez par les fonctions déjà présentes : programmation du chauffe-eau, filtration de piscine, lave-linge, lave-vaisselle et rafraîchissement anticipé. Un contacteur ou un gestionnaire d’énergie peut déclencher une charge quand le surplus dépasse un seuil. La puissance de l’appareil doit toutefois rester compatible avec la production instantanée ; allumer plusieurs équipements simultanément recrée un appel au réseau.',
					'Pour un véhicule électrique, une borne modulante ajuste la recharge au surplus disponible, mais une simple programmation peut déjà apporter un gain. Conservez les contraintes de confort et de sécurité : cycle sanitaire du ballon, durée de filtration adaptée à l’eau, température intérieure et heure de départ du véhicule. Le pilotage est un outil, pas une privation permanente.'
				],
				bullets: [
					'Priorité 1 : charges régulières et peu sensibles à l’horaire.',
					'Priorité 2 : gros usages pilotables avec mesure du surplus.',
					'Priorité 3 : stockage, seulement après observation des excédents.'
				]
			},
			{
				heading: 'Donner au surplus sa juste place',
				paragraphs: [
					'La vente du surplus valorise les kWh non consommés et apporte un cadre contractuel. Elle ne doit pas servir à masquer un surdimensionnement. Le tarif d’achat et les conditions contractuelles évoluent : ils doivent être vérifiés sur les sources officielles au jour de la demande complète de raccordement, et non repris d’une ancienne brochure commerciale.',
					'Dans le calcul, un kWh autoconsommé vaut le prix réseau évité, hors parts fixes qui subsistent ; un kWh vendu vaut le tarif du contrat. Séparez ces flux, puis testez une baisse de production et une évolution prudente du prix réseau pour réduire la dépendance à une hypothèse unique.'
				]
			},
			{
				heading: 'Batterie physique, ballon d’eau chaude ou inertie du bâtiment',
				paragraphs: [
					'Un ballon stocke de la chaleur, la maison peut stocker quelques heures de confort thermique et un véhicule stocke de la mobilité. Ces formes de flexibilité existent parfois sans investissement majeur. Elles ont des limites, mais doivent être exploitées avant de dimensionner une batterie stationnaire dont le rendement, les cycles et la capacité utile réduisent l’énergie restituée.',
					'Une batterie devient plus pertinente lorsque le surplus est fréquent, la consommation du soir stable et les usages flexibles déjà pilotés. Mesurez plusieurs semaines, idéalement une année, avant de fixer 5 ou 10 kWh. La fonction de secours est distincte : elle exige une architecture et une commutation prévues pour les coupures, pas seulement une batterie raccordée à un onduleur.'
				]
			},
			{
				heading: 'Suivre la performance sans confondre météo et panne',
				paragraphs: [
					'Le portail de supervision doit rester accessible au propriétaire. Comparez la production mensuelle au modèle, mais aussi les panneaux ou chaînes entre eux. Une baisse ponctuelle peut provenir des nuages, de la chaleur ou d’une coupure réseau ; un écart durable et localisé mérite un diagnostic. Conservez le dossier de mise en service et les références de tous les composants.',
					'Après la première année, recalculer le taux d’autoconsommation permet d’ajuster les programmations et d’évaluer un futur stockage sur des données réelles. Le piège est de surveiller uniquement le total produit : une centrale peut fonctionner correctement tout en injectant bien plus que prévu. Le suivi utile réunit production, import, export et principaux usages pilotés.'
				]
			}
		],
		faqs: [
			['Quel taux d’autoconsommation viser à Bordeaux ?', 'Il n’existe pas de cible universelle. Sans batterie, de nombreux projets se situent entre 35 et 60 %, mais le résultat dépend du profil horaire et de la puissance. Une étude doit privilégier l’économie réelle, pas un pourcentage flatteur obtenu avec une centrale trop petite.'],
			['La climatisation améliore-t-elle l’autoconsommation ?', 'Souvent, car son besoin estival coïncide avec la production. Il faut néanmoins éviter de créer une consommation inutile : le pilotage peut rafraîchir raisonnablement pendant le plateau solaire tout en conservant les consignes de confort habituelles.'],
			['Peut-on atteindre 100 % d’autonomie toute l’année ?', 'Une maison raccordée au réseau conserve généralement des achats hivernaux et nocturnes, même avec une forte puissance et une batterie. Atteindre 100 % demanderait un surdimensionnement et un stockage considérables. Une autonomie partielle, mesurée et rentable, est souvent un objectif plus rationnel.']
		]
	},
	{
		slug: 'rentabilite-panneaux-solaires-gironde',
		title: 'Rentabilité solaire en Gironde : ROI, TRI et VAN sur 25 ans',
		shortTitle: 'ROI, TRI et VAN du solaire',
		description: 'Analyse financière photovoltaïque en Gironde : temps de retour, TRI, VAN, inflation électrique et dégradation des modules.',
		category: 'Finance',
		readTime: '9 min',
		image: '/images/guide-rentabilite-solaire.png',
		intro: 'Une étude financière solaire ne se résume ni à « facture divisée par deux » ni à un temps de retour affiché sans hypothèses. Elle doit suivre séparément les kWh autoconsommés, les kWh vendus, les dépenses futures et la baisse progressive de production. En Gironde, le gisement solaire soutient le projet, mais la qualité du dimensionnement, le prix payé et le profil d’usage restent déterminants. ROI, TRI et VAN donnent trois lectures complémentaires.',
		sections: [
			{
				heading: 'Commencer par un tableau de flux compréhensible',
				paragraphs: [
					'L’année zéro comprend le prix installé, les travaux électriques ou de toiture nécessaires, les frais de financement et les aides définitivement acquises. Les années suivantes additionnent les achats réseau évités et les recettes de surplus, puis retranchent l’entretien, l’assurance éventuelle, les abonnements et les remplacements. Ne déduisez jamais une aide seulement promise ou un tarif de vente non confirmé.',
					'Chaque hypothèse doit être datée et modifiable. La production vient d’une étude, l’autoconsommation d’une courbe de charge et le surplus du contrat applicable. Pour les tarifs EDF OA et les primes, vérifiez les sources officielles au jour de la demande complète de raccordement.'
				],
				bullets: [
					'Investissement comptant et coût total financé.',
					'Production, autoconsommation et injection séparées.',
					'Maintenance, remplacement et perte de rendement.',
					'Fiscalité et règles contractuelles adaptées au cas du foyer.'
				]
			},
			{
				heading: 'Le temps de retour simple : utile, mais incomplet',
				paragraphs: [
					'Le retour simple divise l’investissement net par le gain de la première année. Exemple purement illustratif : 13 500 € investis et 1 350 € d’économies et recettes donnent dix ans. Le calcul est facile à vérifier, mais suppose implicitement que tous les flux restent constants et ne distingue pas un euro reçu demain d’un euro reçu dans vingt ans.',
					'Utilisez-le comme repère, puis ajoutez un retour actualisé. Si le vendeur annonce sept ans, demandez le détail annuel : production, autoconsommation, prix réseau, surplus, aides et crédit. Une courbe cumulée sans tableau de flux n’est pas vérifiable.'
				]
			},
			{
				heading: 'TRI et VAN : comparer sans transformer la toiture en placement liquide',
				paragraphs: [
					'La valeur actualisée nette, ou VAN, ramène chaque flux futur à sa valeur présente puis retire l’investissement. Une VAN positive au taux choisi indique que le projet dépasse ce rendement de référence. Le taux de rendement interne, ou TRI, est le taux qui ramène la VAN à zéro. Ces outils rendent deux scénarios comparables avec leurs calendriers réels.'
				]
			},
			{
				heading: 'Construire trois scénarios plutôt qu’une prévision parfaite',
				paragraphs: [
					'Le scénario prudent baisse la production simulée, limite la hausse du prix réseau, intègre un remplacement électronique et retarde certains gains. Le scénario central conserve des hypothèses raisonnables et documentées. Le scénario haut peut tester une consommation mieux pilotée, mais ne doit pas inventer une inflation spectaculaire ni supposer que tous les surplus seront autoconsommés.',
					'Une analyse de sensibilité consiste à modifier une variable à la fois : prix initial, production, taux d’autoconsommation, coût du financement ou durée de vie. Si une variation de 10 % renverse complètement le projet, la décision est fragile. Si plusieurs scénarios restent acceptables, le projet dépend moins d’une promesse commerciale précise.'
				],
				bullets: [
					'Production inférieure de 10 % au modèle central.',
					'Remplacement d’onduleur à une date prudente.',
					'Hausse du prix réseau faible, moyenne puis plus soutenue.',
					'Taux d’autoconsommation actuel et après pilotage réaliste.'
				]
			},
			{
				heading: 'Intégrer vieillissement, entretien et aléas',
				paragraphs: [
					'Les modules perdent progressivement de la puissance. Retenir une dégradation annuelle documentée par la garantie, par exemple autour de quelques dixièmes de pour cent, évite de compter la production de première année pendant vingt-cinq ans. L’onduleur, les ventilations, la supervision ou certains coffrets peuvent nécessiter une intervention avant les panneaux.',
					'Prévoyez aussi une petite réserve pour diagnostic, nettoyage seulement s’il est justifié, remplacement de tuiles et éventuelle dépose lors de travaux de toiture. L’assurance habitation doit être informée. Ces coûts ne condamnent pas le projet ; les ignorer rend simplement le retour artificiel. Exigez que l’étude indique ce qui est inclus dans la maintenance et pendant combien de temps.'
				]
			},
			{
				heading: 'Le financement peut changer davantage que le rendement solaire',
				paragraphs: [
					'Comparez toujours prix comptant et coût total du crédit. Un prêt long réduit la mensualité, mais les intérêts et assurances peuvent absorber une part importante des économies. Le bon indicateur n’est pas « mensualité solaire contre facture », car l’abonnement réseau et les achats nocturnes demeurent. Tracez plutôt le flux net annuel après remboursement.',
					'Si un déménagement, un achat immobilier ou une réfection de toiture est probable, raccourcissez l’horizon étudié. La valeur apportée au bien reste difficile à isoler et ne doit pas compenser automatiquement une VAN faible. Le projet doit rester acceptable sans prix de revente supposé.'
				]
			},
			{
				heading: 'Audit express d’une promesse de rentabilité',
				paragraphs: [
					'Demandez le fichier ou le tableau derrière le chiffre annoncé. Vérifiez que la consommation future n’a pas été confondue avec une économie, que la production n’est pas constante pendant vingt-cinq ans et que le tarif de surplus correspond au bon contrat. Contrôlez aussi la date de mise en service retenue et l’existence d’une période sans recettes pendant les démarches.',
					'Une étude sérieuse accepte l’incertitude : elle donne une plage, explique ses limites et permet de modifier les hypothèses. Le piège classique est une courbe cumulée sans détail, associée à un prix de l’électricité arbitrairement multiplié. Gardez une copie datée de l’étude, du devis et des conditions de financement afin de comparer les promesses à la production réelle.'
				]
			}
		],
		faqs: [
			['Quel temps de retour attendre en Gironde ?', 'Il dépend du prix installé, de la production, de l’autoconsommation et du financement. Une plage de sept à onze ans est parfois observée sur des projets cohérents, mais elle ne remplace pas un calcul individuel. Testez aussi un scénario dégradé avant de décider.'],
			['La VAN peut-elle être négative alors que le retour simple semble bon ?', 'Oui. Un taux d’actualisation élevé, des dépenses futures ou des gains tardifs peuvent rendre la VAN négative malgré un cumul nominal positif. C’est précisément pourquoi les deux indicateurs doivent être présentés ensemble avec leurs hypothèses.'],
			['Une batterie améliore-t-elle toujours le TRI ?', 'Non. Elle augmente l’autoconsommation mais ajoute un investissement, des pertes et un vieillissement. Calculez les kWh qu’elle déplacera réellement et comparez leur gain à son coût installé. Dans certains cas, le pilotage des usages offre un meilleur rendement financier.']
		]
	},
	{
		slug: 'aides-financieres-solaire-gironde-2026',
		title: 'Aides financières pour le solaire en 2026 dans le 33 : ce qui s’applique vraiment',
		shortTitle: 'Aides solaires 2026 dans le 33',
		description: 'Prime à l’autoconsommation, EDF OA, TVA et aides solaire 2026 en Gironde : conditions, montants et pièges à éviter.',
		category: 'Aides',
		readTime: '9 min',
		image: '/images/guide-aides-solaires-2026.png',
		path: '/aides-panneau-solaire-33',
		intro: 'Les dispositifs liés au photovoltaïque changent plus vite qu’une toiture. Il faut distinguer prime à l’autoconsommation, contrat d’achat, fiscalité, TVA et éventuels programmes locaux, puis vérifier séparément l’éligibilité de chacun. Ce guide donne une méthode fiable sans figer de montant : les barèmes de prime et tarifs EDF OA sont trimestriels et doivent être contrôlés sur les sources officielles au jour du devis et de la demande complète de raccordement.',
		sections: [
			{
				heading: 'La prime à l’autoconsommation : une règle nationale, pas une remise du vendeur',
				paragraphs: [
					'La prime concerne certaines installations photovoltaïques en autoconsommation avec vente du surplus, dans le respect des conditions techniques et administratives en vigueur. Son niveau dépend notamment de la tranche de puissance et du trimestre tarifaire applicable. Aucun montant lu plusieurs mois auparavant ne doit être reporté tel quel dans un plan de financement.',
					'Demandez la source officielle, la date du barème et un scénario sans prime. Vérifiez la qualification RGE requise, le mode de pose, le raccordement et l’identité du titulaire. Cette prime suit les règles du contrat ; elle n’est pas une remise librement accordée par le vendeur.'
				]
			},
			{
				heading: 'EDF OA et vente du surplus : sécuriser la chronologie',
				paragraphs: [
					'Le contrat d’achat valorise l’électricité injectée selon les conditions attachées à la demande complète de raccordement. Le tarif évolue par périodes réglementaires. Consultez le portail officiel d’EDF OA, Enedis et les textes applicables avant de signer ; une capture d’écran ou une brochure commerciale non datée n’est pas une preuve du tarif futur.',
					'Conservez le récépissé de raccordement, l’attestation de conformité, les factures, les certificats des matériels, le contrat et les index. Vérifiez qui réalise chaque démarche et qui répond à une demande de pièce complémentaire. Une erreur de nom, de puissance ou d’adresse peut ralentir le dossier et modifier la date de référence.'
				],
				bullets: [
					'Barème et tarif vérifiés le jour du devis, puis au dépôt.',
					'Puissance et titulaire identiques sur tous les documents.',
					'Calendrier de raccordement écrit, sans promesse de date garantie.',
					'Accès propriétaire aux portails et contrats.'
				]
			},
			{
				heading: 'TVA à 5,5 % depuis le 1er octobre 2025, sous conditions',
				paragraphs: [
					'Depuis le 1er octobre 2025, la livraison et l’installation photovoltaïque résidentielle jusqu’à 9 kWc peuvent bénéficier d’une TVA à 5,5 %, sous réserve du respect des conditions techniques, environnementales et réglementaires applicables. Le taux n’est donc pas automatique pour tout kit ni toute situation. Le devis doit indiquer le taux utilisé et permettre d’en comprendre la justification.',
					'Si le devis combine panneaux, batterie, couverture ou prestations distinctes, toutes les lignes ne suivent pas nécessairement le même traitement. Demandez à l’entreprise de confirmer l’éligibilité du logement, de la puissance et des équipements, puis contrôlez l’information officielle à jour.'
				]
			},
			{
				heading: 'Ne pas confondre photovoltaïque, solaire thermique et rénovation globale',
				paragraphs: [
					'MaPrimeRénov’ ne constitue pas une subvention générale automatique pour les panneaux photovoltaïques produisant de l’électricité. Certains équipements solaires thermiques ou parcours de rénovation répondent à d’autres règles. Identifiez d’abord la technologie proposée : un chauffe-eau solaire, un système hybride et une centrale photovoltaïque ne relèvent pas nécessairement des mêmes dispositifs.',
					'Un commercial peut additionner des aides de catégories différentes pour afficher un reste à charge séduisant. Demandez le nom exact, le texte d’éligibilité et l’organisme payeur. Les conditions de ressources, d’audit, de bouquet de travaux ou d’accompagnement doivent apparaître avant l’engagement.'
				]
			},
			{
				heading: 'Aides locales et fiscalité : vérifier sans supposer',
				paragraphs: [
					'Une commune, une intercommunalité, le Département ou la Région peuvent ouvrir, modifier ou fermer un programme. Il n’existe pas une « aide Gironde » permanente à présumer pour chaque foyer. Consultez les sites officiels de la collectivité concernée et France Rénov’, puis demandez une confirmation écrite indiquant la date, le budget disponible et la compatibilité avec les autres dispositifs.',
					'La fiscalité de la vente dépend notamment de la puissance, du raccordement et du statut du producteur. Pour une indivision, une société ou un bâtiment professionnel, faites confirmer le traitement par l’administration fiscale ou un conseil compétent.'
				]
			},
			{
				heading: 'Le bon ordre des démarches',
				paragraphs: [
					'Commencez par l’étude technique et un devis conditionné aux autorisations, puis vérifiez urbanisme, RGE, assurances et règles de raccordement. Déposez les demandes qui exigent une antériorité avant le chantier. Ne commencez pas les travaux sur la base d’une promesse orale si le dispositif impose une demande préalable ou une entreprise qualifiée.',
					'Créez un dossier numérique avec devis signé, attestations, plans, déclaration préalable, réponse de mairie, demande de raccordement, Consuel, facture acquittée et échanges avec l’acheteur. Notez les identifiants et échéances. Cette discipline évite de perdre une pièce au moment du versement et facilite une revente future du logement.'
				],
				bullets: [
					'1. Étude et comparaison de devis sans engagement précipité.',
					'2. Vérification officielle de chaque dispositif et condition.',
					'3. Autorisations et demandes préalables avant travaux.',
					'4. Réception, raccordement et conservation des justificatifs.'
				]
			},
			{
				heading: 'Reconnaître les fausses aides et calculer sans elles',
				paragraphs: [
					'« Panneaux gratuits », « prise en charge à 100 % » ou « dernière journée pour bénéficier du plan de l’État » sont des signaux d’alerte. Une remise commerciale n’est pas une aide publique et un crédit n’est pas une subvention. Refusez de communiquer un code bancaire ou fiscal à un interlocuteur qui vous démarche sans procédure officielle clairement identifiée.',
					'Refaites toujours la rentabilité sans aide, puis ajoutez seulement les montants confirmés. Si le projet devient intenable dès qu’une prime baisse ou tarde, le prix ou la puissance mérite d’être revu. Les organismes officiels n’exigent pas une signature immédiate à domicile. Utilisez le délai de réflexion pour contrôler l’entreprise, le financement et les conditions de rétractation.'
				]
			}
		],
		faqs: [
			['Quel est le montant de la prime à l’autoconsommation en 2026 ?', 'Il varie selon la puissance et le trimestre tarifaire. Pour éviter un chiffre périmé, consultez les sources officielles au jour du devis puis au dépôt de la demande complète de raccordement. Exigez que l’installateur date et référence son hypothèse.'],
			['La TVA à 5,5 % s’applique-t-elle à toutes les installations ?', 'Non. Depuis le 1er octobre 2025, elle peut concerner le photovoltaïque résidentiel jusqu’à 9 kWc, sous conditions. La puissance, les caractéristiques techniques et la nature des prestations doivent être vérifiées ; le devis doit justifier le taux retenu.'],
			['Une aide locale peut-elle se cumuler avec la prime nationale ?', 'Parfois, mais jamais par principe. Le règlement local précise bénéficiaires, dépenses, date de demande, enveloppe et règles de cumul. Obtenez une confirmation de la collectivité concernée et construisez un scénario financier qui reste viable si le programme ferme.']
		]
	},
	{
		slug: 'panneaux-solaires-patrimoine-unesco-bordeaux',
		title: 'Panneaux solaires et patrimoine UNESCO à Bordeaux : réussir son projet avec l’ABF',
		shortTitle: 'Solaire & patrimoine UNESCO',
		description: 'Installer des panneaux solaires à Bordeaux en secteur patrimonial : déclaration préalable, ABF, panneaux full black et intégration des échoppes.',
		category: 'Patrimoine',
		readTime: '9 min',
		image: '/images/guide-patrimoine-unesco-bordeaux.png',
		path: '/guide-solaire-patrimoine-bordeaux',
		intro: 'À Bordeaux, la valeur d’un projet solaire se mesure aussi à sa discrétion. Le périmètre UNESCO, les abords de monuments historiques, les secteurs d’échoppes et certaines perspectives urbaines imposent une lecture précise de la parcelle. Un refus n’est ni automatique ni impossible : la réussite dépend d’un diagnostic réglementaire précoce, d’un calepinage sobre et d’un dossier qui montre le bâtiment depuis l’espace public. L’urbanisme doit être résolu avant de promettre une production ou une date de chantier.',
		sections: [
			{
				heading: 'Identifier les protections à l’adresse exacte',
				paragraphs: [
					'Deux maisons d’une même rue peuvent relever de contraintes différentes selon la visibilité, le zonage et le bâtiment concerné. Consultez le PLU, le plan de sauvegarde ou les servitudes disponibles, puis interrogez le service urbanisme avec la référence cadastrale. La présence dans un périmètre patrimonial ne signifie pas que toutes les toitures sont traitées de façon identique.',
					'La modification de l’aspect extérieur nécessite généralement une déclaration préalable. Aux abords d’un monument ou dans un secteur protégé, l’Architecte des Bâtiments de France peut formuler un accord, des prescriptions ou une opposition selon le régime applicable. Demandez à la mairie quelle autorité instruira le dossier.'
				],
				bullets: [
					'Adresse, parcelle cadastrale et pan de toiture concernés.',
					'Visibilité depuis la rue, une place ou un monument.',
					'Règles de matériaux, teintes, saillies et alignements.',
					'Type d’avis et délai d’instruction à confirmer avec la mairie.'
				]
			},
			{
				heading: 'Faire un prédiagnostic avant de figer le devis',
				paragraphs: [
					'Photographiez la toiture depuis plusieurs points de l’espace public, puis repérez faîtage, cheminées, lucarnes, noues et ombres. Un installateur doit proposer au moins deux implantations : la plus performante et une variante plus discrète. Le devis définitif peut être conditionné à l’autorisation afin d’éviter de payer un matériel qui ne correspondrait plus au projet approuvé.',
					'Un échange informel avec l’urbanisme peut orienter le dossier sans préjuger de la décision. Présentez croquis, dimensions et visibilité. Cette étape révèle parfois qu’un pan arrière, une annexe ou un garage offre un meilleur compromis, et précise si une insertion graphique ou des vues lointaines seront attendues.'
				]
			},
			{
				heading: 'Dessiner un champ solaire calme et lisible',
				paragraphs: [
					'Un rectangle compact, parallèle au faîtage et aux rives, s’intègre mieux qu’un assemblage dispersé autour des accidents de toiture. Les modules noirs à cadre assorti réduisent les contrastes, mais la couleur ne suffit pas : les espaces irréguliers, câbles visibles et dispositifs brillants attirent davantage le regard qu’une différence subtile de teinte.',
					'Préservez les éléments qui composent l’échoppe ou l’immeuble : corniche, ligne de brisis, lucarne, souche de cheminée et rythme des travées. Évitez de couvrir jusqu’aux bords uniquement pour gagner quelques centaines de watts-crête. Dans un contexte patrimonial, une puissance légèrement moindre peut accélérer l’acceptation et sécuriser l’investissement.'
				],
				bullets: [
					'Modules homogènes, sans damier ni réserves incohérentes.',
					'Chemins de câbles et coffrets placés hors des vues principales.',
					'Fixations compatibles avec la couverture et faible surépaisseur.',
					'Distance régulière aux rives, faîtage et éléments anciens.'
				]
			},
			{
				heading: 'Constituer un dossier qui répond aux vraies questions',
				paragraphs: [
					'Le dossier comprend habituellement plans de situation et de masse, état existant, plan des façades et toitures modifiées, photographies proches et lointaines, insertion et notice. Indiquez les dimensions exactes, l’épaisseur, la teinte, la finition des cadres et l’emplacement des équipements extérieurs. Une image générique de panneau ne décrit pas le rendu réel.',
					'Le photomontage respecte perspective, échelle et luminosité. Montrez le champ depuis la rue et depuis son angle le plus visible afin d’éviter une demande de complément. Joignez les fiches utiles, sans noyer l’instructeur sous des documents électriques sans rapport avec l’aspect extérieur.'
				]
			},
			{
				heading: 'Comprendre prescription, modification et recours',
				paragraphs: [
					'Une prescription peut déplacer le champ, réduire sa surface, imposer une teinte ou demander une pose moins saillante. Chiffrez la variante avant de l’accepter et faites mettre à jour production, devis et plans. Ne laissez pas l’équipe de pose interpréter oralement la décision : le chantier doit correspondre exactement aux documents autorisés.',
					'En cas d’opposition, demandez les motifs écrits et étudiez un autre pan, une annexe ou un projet réduit. Un recours suit des délais juridiques et ne doit jamais être présenté comme une formalité dont l’issue serait garantie.'
				]
			},
			{
				heading: 'Préserver la performance malgré une implantation contrainte',
				paragraphs: [
					'Déplacer les modules vers un pan secondaire peut modifier orientation, pente et ombrage. Demandez une simulation comparant les variantes avec les mêmes pertes. Sur plusieurs pans ou en présence d’ombres partielles, une gestion par module peut être pertinente ; elle ne transforme toutefois pas un pan nord très masqué en implantation idéale.',
					'Exemple pratique : si le pan rue permet 4,5 kWc mais reste très visible, un pan arrière de 3,6 kWc peut produire un peu moins tout en conservant une meilleure probabilité d’autorisation. Comparez kWh annuels, autoconsommation et coût, pas seulement la puissance. La stabilité de la couverture et l’accès de maintenance restent prioritaires.'
				]
			},
			{
				heading: 'Réceptionner le chantier comme une intervention patrimoniale',
				paragraphs: [
					'Avant pose, protégez les tuiles anciennes et définissez le stockage du matériel. Vérifiez que les remplacements utilisent des éléments compatibles et que les traversées, abergements et fixations respectent la couverture. Les photos prises avant fermeture des chemins techniques seront précieuses pour l’entretien et une future rénovation.',
					'À la réception, confrontez l’installation aux plans autorisés depuis les mêmes points de vue que le dossier. Conservez décision d’urbanisme, déclaration d’achèvement si applicable, plans, attestations et photographies. Le piège est une modification improvisée sur le toit : même techniquement mineure, elle peut créer un écart visible et administratif durable.'
				]
			}
		],
		faqs: [
			['L’ABF peut-il interdire des panneaux solaires à Bordeaux ?', 'Une opposition ou des prescriptions sont possibles selon la protection, la visibilité et la qualité du projet. Il n’existe pas de réponse valable pour toute la ville. Un calepinage plus discret, un autre pan ou une annexe peuvent parfois rendre une nouvelle proposition acceptable.'],
			['Les panneaux full black garantissent-ils l’autorisation ?', 'Non. Ils réduisent les contrastes, mais l’implantation, la forme du champ, la visibilité, la saillie et le traitement des câbles comptent autant. Présentez un ensemble cohérent plutôt qu’un argument fondé uniquement sur la couleur.'],
			['Que faire si seule la toiture sur rue est bien orientée ?', 'Faites comparer la meilleure implantation technique à une variante discrète, avec production et coût. Un échange préalable avec l’urbanisme peut préciser les attentes. Si aucune solution en toiture n’est acceptable, étudiez une annexe ou une ombrière autorisable, sans présumer de leur accord.']
		]
	},
	{
		slug: 'batterie-solaire-autoconsommation-gironde',
		title: 'Batterie solaire et autoconsommation : dimensionner 5 ou 10 kWh dans le 33',
		shortTitle: 'Batterie solaire 5 ou 10 kWh',
		description: 'Batterie solaire LFP en Gironde : capacité utile, cycles, rendement, onduleur hybride, secours et rentabilité.',
		category: 'Stockage',
		readTime: '9 min',
		image: '/images/guide-batterie-solaire.png',
		intro: 'Une batterie ne crée aucun kWh : elle décale une partie du surplus solaire vers le soir ou la nuit. Son intérêt dépend donc moins de la puissance inscrite sur les panneaux que du surplus horaire réellement disponible et des besoins après le coucher du soleil. En Gironde, les excédents d’été peuvent être abondants tandis que plusieurs jours d’hiver restent peu productifs. Dimensionner 5 ou 10 kWh exige des données, une architecture claire et un calcul séparant autonomie, secours et rentabilité.',
		sections: [
			{
				heading: 'Mesurer le surplus avant de choisir la capacité',
				paragraphs: [
					'La facture annuelle ne suffit pas. Il faut connaître, par pas horaire ou plus fin, la production injectée et la consommation après la période solaire. Une batterie de 10 kWh est surdimensionnée si la centrale ne dispose régulièrement que de 3 kWh excédentaires, ou si le logement n’utilise que 2 kWh avant le retour du soleil.',
					'Avant installation, demandez une simulation croisant météo, orientation et courbe de charge. Après mise en service, une saison de mesure réduit l’incertitude. Séparez été, intersaison et hiver : une capacité remplie en juillet peut rester presque vide plusieurs jours en décembre.'
				],
				bullets: [
					'Surplus quotidien médian, pas uniquement le maximum observé.',
					'Consommation entre fin de production et reprise le lendemain.',
					'Nombre de jours où la batterie peut effectuer un cycle utile.',
					'Usages déjà déplaçables sans stockage.'
				]
			},
			{
				heading: '5 ou 10 kWh : raisonner en capacité utile',
				paragraphs: [
					'La capacité nominale est celle annoncée par le fabricant ; la capacité utile tient compte de la plage de charge autorisée pour préserver les cellules. Comparez cette dernière. Exemple illustratif : un foyer consomme habituellement 4 kWh le soir et dispose de 5 kWh de surplus. Une batterie autour de 5 kWh utiles peut couvrir l’essentiel sans immobiliser une capacité rarement exploitée.',
					'Dix kWh deviennent plus crédibles avec un surplus régulier supérieur, une consommation nocturne soutenue ou un secours défini. Ils ne garantissent rien si le soleil n’a pas chargé le système. Une gamme modulaire permet parfois de commencer petit et d’ajouter un bloc après observation.'
				]
			},
			{
				heading: 'Ne pas confondre énergie stockée et puissance disponible',
				paragraphs: [
					'Les kWh indiquent la durée ; les kW indiquent combien d’appareils peuvent fonctionner simultanément. Une batterie de 10 kWh limitée à 3 kW ne peut pas alimenter ensemble une plaque, un chauffe-eau et une borne de recharge à pleine puissance. Vérifiez puissance continue, pointe temporaire, puissance de charge et équilibre entre phases le cas échéant.',
					'Listez les charges prioritaires et leurs appels au démarrage. Pour l’autoconsommation simple, une puissance modérée peut suffire. Pour le secours, le réfrigérateur, l’éclairage, la box, un portail ou un appareil médical doivent être identifiés sur un tableau dédié. Le chauffage électrique complet et la recharge rapide exigent généralement une architecture bien plus lourde.'
				],
				bullets: [
					'Capacité utile en kWh et réserve minimale.',
					'Puissance continue et pointe en kW.',
					'Rendement aller-retour mesuré dans des conditions précisées.',
					'Possibilité réelle d’alimenter les circuits choisis.'
				]
			},
			{
				heading: 'LFP, cycles et conditions d’installation',
				paragraphs: [
					'La chimie lithium-fer-phosphate, dite LFP, est répandue pour sa stabilité thermique et sa durée de vie. Comparez néanmoins les garanties en années, nombre de cycles, énergie totale délivrée et capacité résiduelle. Une garantie de dix ans n’a pas le même sens si elle exclut certains régimes ou si le support dépend d’un installateur introuvable.',
					'Respectez température, ventilation, humidité, distance aux sources de chaleur et prescriptions du fabricant. Un garage très chaud ou un local inondable n’est pas neutre. Batterie, protections et câbles doivent rester accessibles, sans exposition aux chocs, avec procédure d’arrêt expliquée aux occupants.'
				]
			},
			{
				heading: 'Onduleur hybride, couplage AC et fonction secours',
				paragraphs: [
					'Une batterie couplée côté courant continu s’intègre souvent à un onduleur hybride ; un couplage alternatif peut faciliter l’ajout à une installation existante. Les rendements, compatibilités et comportements en panne diffèrent. Exigez un schéma indiquant mesure, protections, emplacement de la batterie et flux autorisés, plutôt qu’une simple mention « battery ready ».',
					'Lors d’une coupure réseau, l’onduleur photovoltaïque standard s’arrête pour protéger les intervenants. La fonction backup requiert une déconnexion contrôlée du réseau et, selon le système, un tableau de circuits secourus. Vérifiez le temps de bascule, la puissance disponible, la recharge solaire en mode isolé et les limites. « Batterie installée » ne signifie donc pas « maison autonome ».'
				]
			},
			{
				heading: 'Calculer le coût du kWh déplacé',
				paragraphs: [
					'Le gain unitaire correspond approximativement au prix réseau évité moins la valeur de vente du surplus auquel on renonce, puis il faut appliquer les pertes. Multipliez ce gain par les kWh réellement décalés, pas par la capacité nominale fois 365. Intégrez dégradation, disponibilité, éventuel abonnement de supervision et remplacement sur l’horizon étudié. Comparez enfin sans batterie, avec 5 kWh et avec 10 kWh sur les mêmes hypothèses.'
				]
			},
			{
				heading: 'Checklist avant commande et stratégie évolutive',
				paragraphs: [
					'Demandez références exactes, capacité utile, puissance, rendement, garantie, conditions d’environnement, compatibilité logicielle et propriété des données. Faites préciser la fonction secours, les circuits alimentés, les mises à jour et l’interlocuteur après-vente. Vérifiez aussi si un abonnement cloud est nécessaire au fonctionnement ou uniquement au suivi.',
					'Le piège est d’acheter une grande batterie avec une centrale surdimensionnée pour la remplir. Commencez par piloter le ballon, la piscine ou le véhicule, puis mesurez. Si le stockage reste souhaité, une conception modulaire et un emplacement préparé peuvent préserver la possibilité d’évolution sans payer immédiatement une capacité peu utilisée.'
				],
				bullets: [
					'Simulation basée sur import et export horaires.',
					'Schéma électrique et limites du secours écrits.',
					'Prix comptant, financement et abonnement séparés.',
					'Plan de maintenance, garantie et fin de vie documentés.'
				]
			}
		],
		faqs: [
			['Quelle batterie associer à une installation de 6 kWc ?', 'La puissance solaire ne suffit pas pour répondre. Mesurez le surplus et la consommation du soir. Pour certains foyers, environ 5 kWh utiles est cohérent ; d’autres peuvent exploiter 10 kWh, tandis qu’un profil très diurne n’a besoin d’aucun stockage.'],
			['Une batterie alimente-t-elle la maison lors d’une coupure ?', 'Seulement si l’installation comprend une fonction de secours, une commutation et des circuits prévus à cet effet. Vérifiez la puissance, le temps de bascule et la capacité de recharge solaire en mode isolé. Un stockage standard peut s’arrêter avec le réseau.'],
			['Est-il préférable d’attendre avant d’ajouter une batterie ?', 'Souvent, une année de données réelles affine fortement le choix. Prévoyez dès l’origine l’espace, le schéma et la compatibilité si l’ajout est probable. Vérifiez toutefois que la gamme annoncée restera compatible : « évolutif » doit être détaillé par écrit.']
		]
	},
	{
		slug: 'solaire-vignoble-bordelais',
		title: 'Solaire et vignoble : comment les domaines bordelais adoptent le photovoltaïque',
		shortTitle: 'Solaire & vignoble bordelais',
		description: 'Photovoltaïque dans les vignobles de Bordeaux : toitures de chai, autoconsommation, intégration paysagère et retour d’expérience pour les maisons.',
		category: 'Vignoble',
		readTime: '9 min',
		image: '/images/guide-solaire-vignoble-bordelais.png',
		intro: 'Le photovoltaïque peut bien s’accorder avec un domaine viticole : le froid, le pompage, la ventilation, le conditionnement et certains ateliers consomment pendant les heures de production. Mais la grande toiture d’un chai n’est pas une invitation à la couvrir sans étude. La saisonnalité des usages, la structure, la sécurité incendie, le raccordement et la perception paysagère déterminent le projet. Cette logique professionnelle offre aussi des enseignements très concrets aux maisons girondines.',
		sections: [
			{
				heading: 'Cartographier une consommation très saisonnière',
				paragraphs: [
					'Commencez par récupérer les courbes de charge et les factures sur au moins douze mois. Repérez les besoins permanents, les groupes froids, les pompes, l’air comprimé, la ventilation, la mise en bouteille et les pointes des vendanges. Une moyenne annuelle masque les jours où plusieurs équipements fonctionnent ensemble et les périodes où le chai consomme très peu.',
					'Associez chaque usage à son horaire et à sa flexibilité. Certains cycles de froid ou de pompage peuvent être déplacés sans affecter le process ; d’autres répondent à une exigence œnologique. L’énergie solaire sert l’exploitation, jamais l’inverse : tout pilotage doit être validé par les responsables techniques.'
				],
				bullets: [
					'Talon de consommation hors vendanges.',
					'Pointes de puissance et simultanéité des équipements.',
					'Saisonnalité du froid, du pompage et du conditionnement.',
					'Usages déplaçables sans risque pour la production.'
				]
			},
			{
				heading: 'Dimensionner sur la courbe, pas sur les mètres carrés',
				paragraphs: [
					'Une toiture de chai peut accueillir bien plus de panneaux que l’exploitation n’en autoconsomme. Testez plusieurs puissances et calculez, pour chacune, import réseau, autoconsommation et injection par mois. Un projet destiné à vendre une part importante de sa production doit être étudié comme tel, avec ses règles de raccordement et ses hypothèses économiques propres.',
					'Exemple illustratif : si le site maintient 20 kW de besoin diurne hors pointes, une première variante peut viser ce socle avant d’intégrer les usages saisonniers. La simulation inclut week-ends, fermeture, vendanges et extensions ; elle ne se cale pas sur la seule semaine la plus consommatrice.'
				]
			},
			{
				heading: 'Vérifier la charpente, la couverture et l’exploitation du bâtiment',
				paragraphs: [
					'Avant le calepinage, un diagnostic examine portée, corrosion, assemblages, charges permanentes, vent, état des plaques ou tuiles et présence éventuelle de matériaux nécessitant des précautions particulières. Les anciennes charpentes agricoles et les grandes portées ne s’évaluent pas par photographie. Une réfection prévue dans quelques années doit précéder ou intégrer le solaire.',
					'Conservez les accès aux lanterneaux, désenfumage, gouttières, équipements de ventilation et zones d’entretien. Le chantier doit être organisé autour de l’activité, des engins, des produits et des périodes sensibles. Définissez circulation, stockage, protection contre les chutes et procédure d’arrêt afin que la centrale ne complique pas l’exploitation quotidienne.'
				],
				bullets: [
					'Note structurelle et système de fixation compatibles.',
					'Plan des accès, dispositifs de sécurité et maintenance.',
					'Cheminement électrique protégé des chocs et de l’humidité.',
					'Coordination avec les travaux de toiture futurs.'
				]
			},
			{
				heading: 'Respecter paysage, patrimoine et identité du domaine',
				paragraphs: [
					'Dans le Médoc, l’Entre-deux-Mers, les Graves ou autour de Saint-Émilion, les bâtiments participent à la perception du vignoble. Consultez urbanisme, protections patrimoniales et visibilité avant de figer l’implantation. Un grand rectangle homogène sur un versant secondaire est souvent plus calme qu’une mosaïque répartie sur plusieurs toitures.',
					'Préparez des vues proches et lointaines, notamment depuis les accès visiteurs. Pour un projet au sol, une ombrière ou une solution agrivoltaïque, vérifiez le régime propre auprès des autorités compétentes : les règles ne se déduisent pas de celles d’une toiture.'
				]
			},
			{
				heading: 'Concevoir l’électricité autour de la continuité d’activité',
				paragraphs: [
					'Le point de livraison, la puissance souscrite, le régime triphasé, les protections et la capacité d’injection doivent être relevés. Une production importante peut nécessiter une étude de raccordement et des délais qui influencent le calendrier. Les tarifs et conditions de vente évoluent : vérifiez les sources officielles au jour du dossier, sans reprendre un ancien montant.',
					'La supervision doit distinguer production, import, export et principaux ateliers. Prévoyez l’alerte en cas de défaut, l’accès des secours, la signalétique et la procédure de consignation. Une batterie éventuelle répond soit au pilotage économique, soit à la continuité de charges choisies ; elle ne remplace pas automatiquement un groupe de secours ni une étude de sélectivité.'
				]
			},
			{
				heading: 'Évaluer l’économie avec les risques de l’exploitation',
				paragraphs: [
					'Le modèle financier sépare kWh autoconsommés, kWh vendus, investissement, financement, maintenance et remplacement d’onduleur. Testez une récolte ou une activité moins intense, une production solaire plus faible et un raccordement plus coûteux. Les aides ou tarifs doivent être confirmés sur les sources officielles et le projet doit rester compréhensible sans subvention incertaine. Un bail de toiture doit aussi préciser accès, responsabilités, travaux futurs et fin de contrat détaillée.'
				]
			},
			{
				heading: 'Ce qu’une maison girondine peut apprendre d’un chai',
				paragraphs: [
					'La première leçon est la concordance des usages. À la maison, chauffe-eau, piscine, climatisation et véhicule peuvent jouer le rôle des pompes et du froid : ils sont pilotés quand le soleil produit, dans le respect du besoin. La seconde est le dimensionnement : la surface disponible ne décide pas de la puissance utile.',
					'La troisième est la réception documentée. Conservez étude, photos, schémas, accès au suivi et valeurs de référence, puis comparez chaque mois production et consommation. Le piège commun aux domaines et aux particuliers est de croire qu’un grand toit garantit un bon projet. La valeur vient de l’usage des kWh, de la qualité de pose et de la maintenance.'
				],
				bullets: [
					'Mesurer avant de dimensionner.',
					'Piloter seulement les usages réellement flexibles.',
					'Préserver l’architecture et les accès de maintenance.',
					'Suivre production et consommation, pas seulement la facture.'
				]
			}
		],
		faqs: [
			['Pourquoi un chai est-il souvent favorable à l’autoconsommation ?', 'Ses équipements de froid, pompage, ventilation ou conditionnement peuvent fonctionner en journée. La concordance doit néanmoins être mesurée sur une année, car les vendanges et certaines opérations créent des pointes très saisonnières.'],
			['Peut-on couvrir toute la toiture disponible ?', 'Techniquement parfois, économiquement pas toujours. La structure, le raccordement, l’injection, les accès et le paysage peuvent limiter le champ. Testez plusieurs puissances sur la courbe de charge avant d’utiliser la surface comme objectif.'],
			['Les particuliers peuvent-ils appliquer la même méthode ?', 'Oui. Une maison gagne à mesurer son talon, programmer ses usages flexibles, vérifier sa toiture et suivre la production. Le projet est plus petit, mais la logique reste identique : faire coïncider les kWh avec un besoin réel.']
		]
	},
	{
		slug: 'installateur-solaire-rge-qualipv-gironde',
		title: 'Choisir un installateur solaire RGE QualiPV en Gironde',
		shortTitle: 'Choisir un installateur QualiPV',
		description: 'Les critères pour sélectionner un installateur photovoltaïque RGE QualiPV dans le 33 : assurances, étude, matériel, garanties et service.',
		category: 'Installateur',
		readTime: '9 min',
		image: '/images/guide-installateur-rge.png',
		intro: 'Choisir un installateur solaire en Gironde revient à confier simultanément toiture, électricité, démarches et performance à une entreprise. Le logo RGE est un filtre nécessaire pour certains dispositifs, pas une garantie absolue de qualité. La bonne sélection repose sur des vérifications simples, une visite technique, une étude explicable et un contrat qui nomme les responsabilités. Deux ou trois offres comparables valent mieux qu’une dizaine de simulations automatiques sans inspection du bâtiment.',
		sections: [
			{
				heading: 'Vérifier l’entreprise derrière la marque commerciale',
				paragraphs: [
					'Relevez la raison sociale, le numéro d’immatriculation, l’adresse et l’identité de l’entreprise qui facturera et posera. Contrôlez sa qualification RGE QualiPV dans l’annuaire officiel, avec le bon domaine et des dates couvrant les travaux. Une capture ancienne ou le certificat d’un sous-traitant non nommé ne suffit pas.',
					'Demandez la décennale et vérifiez qu’elle couvre l’activité photovoltaïque, la technique de pose et la période du chantier. La raison sociale doit correspondre au devis. Si vente, étude et pose relèvent de plusieurs acteurs, obtenez leur identité et la répartition des responsabilités avant l’acompte.'
				],
				bullets: [
					'RGE vérifié dans l’annuaire officiel le jour du choix.',
					'Décennale complète et cohérente avec le devis.',
					'Poseur et éventuels sous-traitants identifiés.',
					'Coordonnées d’un service après-vente joignable.'
				]
			},
			{
				heading: 'Une vraie visite technique ne tient pas sur le pas de la porte',
				paragraphs: [
					'Le technicien relève couverture, charpente accessible, pente, orientation, ombres, cheminement des câbles, tableau, terre, compteur et point de raccordement. Il repère tuiles fragiles, amiante éventuelle, écran sous-toiture, ventilation et travaux futurs. Une vue satellite prépare la visite, mais ne permet pas de confirmer l’état d’une fixation ou d’un tableau.',
					'Présentez factures, courbe de charge, chauffage, piscine, climatisation, véhicule et projets futurs. Demandez pourquoi 3, 6 ou 9 kWc est proposé : la réponse doit relier production, usages et surplus. Si la puissance change pour obtenir une remise ou remplir le toit, réclamez une variante.'
				]
			},
			{
				heading: 'Lire l’étude de production et ses limites',
				paragraphs: [
					'L’étude doit préciser localisation, azimut, pente, masques, données météo, pertes et dégradation. Elle distingue production annuelle, autoconsommation, injection et achats réseau. Idéalement, elle montre les résultats mensuels et explique le profil de consommation utilisé. Une courbe sans hypothèses ne permet pas de vérifier la promesse.',
					'Comparez les offres avec les mêmes données et testez une production inférieure de 10 %. Les barèmes de prime et tarifs EDF OA doivent être vérifiés aux sources officielles au jour du devis et de la demande complète de raccordement ; refusez un montant non daté.'
				],
				bullets: [
					'Logiciel ou méthode de simulation nommé.',
					'Ombres proches et lointaines prises en compte.',
					'Production et consommation séparées mois par mois.',
					'Scénario prudent disponible, sans aide incertaine.'
				]
			},
			{
				heading: 'Comparer le devis ligne par ligne',
				paragraphs: [
					'Le devis indique marques, modèles, quantités, puissance, fixation, onduleur ou micro-onduleurs, protections, câbles, monitoring et travaux de couverture. Il précise échafaudage, évacuation, mise à la terre, remise en état et formation. « Panneau haut rendement » ou « onduleur premium » ne sont pas des références vérifiables.',
					'Distinguez garanties produit, performance, main-d’œuvre et étanchéité. Vérifiez qui avance les frais de remplacement et qui diagnostique une panne. La disponibilité future d’un module identique n’est jamais certaine ; demandez comment une référence équivalente serait intégrée. Le propriétaire doit conserver les identifiants du portail de supervision.'
				]
			},
			{
				heading: 'Clarifier urbanisme, raccordement et contrat',
				paragraphs: [
					'Faites lister la déclaration préalable, le dossier Enedis, le Consuel lorsque requis, le contrat d’achat et la mise en service. Le devis précise ce qui est inclus, les frais externes et la réponse attendue du propriétaire. En secteur patrimonial, une condition liée à l’autorisation évite de figer trop tôt le matériel.',
					'Lisez calendrier de paiement, acompte, délai, rétractation, réserve de propriété, médiateur et conditions d’annulation. Pour un crédit, comparez coût total et prix comptant ; ne signez pas parce qu’une mensualité serait « inférieure à la facture ». Aucun installateur sérieux ne peut garantir une date de raccordement dépendant du gestionnaire de réseau.'
				]
			},
			{
				heading: 'Surveiller le chantier et organiser une vraie réception',
				paragraphs: [
					'Avant pose, confirmez le plan de calepinage et l’emplacement des coffrets. Pendant les travaux, les tuiles doivent être manipulées avec soin, les câbles protégés et les traversées traitées proprement. Des photos avant fermeture documentent fixations et cheminements. Une modification substantielle doit être validée, pas improvisée par l’équipe.',
					'À la réception, testez coupures, supervision, affichage des puissances et accès propriétaire. Relevez les réserves par écrit et liez le solde à leur traitement selon le contrat. Récupérez facture, attestation, schémas, notices, numéros de série, photos, garanties et preuve des démarches. Demandez la conduite à tenir en cas d’alerte ou de fuite.'
				],
				bullets: [
					'Calepinage conforme au devis et à l’autorisation.',
					'Étiquetage, protections et arrêt expliqués.',
					'Monitoring créé au nom du propriétaire.',
					'Dossier technique complet remis à la réception.'
				]
			},
			{
				heading: 'Évaluer le service après-vente avant d’en avoir besoin',
				paragraphs: [
					'Appelez le numéro de support avant de signer et demandez le délai habituel de diagnostic. Vérifiez qui surveille les alertes, comment sont traités un micro-onduleur défaillant ou une infiltration et si le déplacement est facturé. Des garanties longues n’ont de valeur que si la procédure et l’interlocuteur sont clairs. Demandez aussi le sort du suivi si l’entreprise cesse ultérieurement son activité.',
					'Le piège principal reste la pression : remise valable quelques heures, aide prétendument imminente, crédit signé sur tablette ou discours refusant toute comparaison. Accordez plus de poids aux réponses écrites, à la cohérence technique et à la qualité du dossier qu’au nombre d’avis. Un bon professionnel accepte qu’un client vérifie son assurance et réfléchisse.'
				]
			}
		],
		faqs: [
			['Comment vérifier un installateur RGE QualiPV ?', 'Recherchez sa raison sociale dans l’annuaire officiel et contrôlez domaine, dates et adresse. Demandez aussi la décennale photovoltaïque. Le RGE facilite certaines démarches mais ne remplace ni la visite technique, ni l’étude, ni la vérification des assurances.'],
			['Combien de devis faut-il comparer ?', 'Deux ou trois offres détaillées suffisent souvent si elles reposent sur les mêmes factures, la même toiture et des puissances comparables. Au-delà, le volume peut masquer les différences. Demandez surtout une variante de dimensionnement et les hypothèses de chaque étude.'],
			['Quels signaux doivent faire arrêter la discussion ?', 'Une signature exigée le jour même, des panneaux présentés comme gratuits, une production garantie sans étude, un RGE invérifiable, des références absentes ou un crédit peu expliqué justifient de suspendre le projet. Demandez les documents et comparez avant tout acompte.']
		]
	}
];

export const guidesBySlug = Object.fromEntries(guides.map((guide) => [guide.slug, guide]));
