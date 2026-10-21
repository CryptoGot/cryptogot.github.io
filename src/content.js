/* =============================================================
   Contenu du portfolio : ton professionnel, première personne.
   Les textes suivent profil/faits.md (dossier Job). Les preuves
   et images viennent de public/assets.
============================================================= */

export const PROFILE = {
  nom: 'Aurélien Lannoye',
  role: 'Développeur web et automatisation IA',
  sousRole: 'Agents IA, n8n, web et jeux vidéo',
  liens: [
    { id: 'rapide', emoji: '⚡', label: 'Version rapide (projets et CV)', url: '/rapide.html' },
    { id: 'github', emoji: '💻', label: 'GitHub', url: 'https://github.com/CryptoGot?tab=repositories' },
    { id: 'linkedin', emoji: '💼', label: 'LinkedIn', url: 'https://www.linkedin.com/in/aurelien-lannoye-05218940a/' },
    { id: 'mail', emoji: '✉️', label: 'aurlannoye@gmail.com', url: 'mailto:aurlannoye@gmail.com' },
    { id: 'cv', emoji: '📄', label: 'Mon CV (PDF)', url: '/docs/CV_Aurelien_Lannoye_Dev_FR.pdf' },
    { id: 'cv-en', emoji: '📄', label: 'CV in English (PDF)', url: '/docs/CV_Aurelien_Lannoye_Dev_EN.pdf' }
  ]
};

/* ============== LES 3 COFFRES (à propos de moi) ============== */

export const COFFRES = {
  projet: {
    emoji: '🎯',
    titre: 'Mon projet pro',
    sousTitre: 'Là où je vais',
    intro: "Rejoindre une équipe où je construis des agents IA et des automatisations utiles, et où j'apprends autant que je développe. Le jeu vidéo reste ma deuxième piste, et je continue à publier des jeux en parallèle.",
    liste: [
      'Construire des agents IA fiables, utilisés par de vrais clients',
      "Progresser en code écrit à la main, à côté du développement avec l'IA",
      'Travailler en équipe sur un produit, avec des retours réguliers',
      'Continuer à publier des jeux (Slurp sur CrazyGames, Somnum et Escape The Brainrots sur Steam)',
      "Trouver une équipe où l'ambiance est bonne, c'est ce qui compte le plus pour moi"
    ]
  },
  forces: {
    emoji: '💪',
    titre: 'Mes forces',
    sousTitre: 'Ce que j’apporte',
    intro: null,
    blocs: [
      { titre: 'Investi', texte: "Quand un projet me prend, j'y consacre des journées entières. Somnum et Escape The Brainrots m'ont demandé environ 400 heures chacun, sur trois mois, sans lâcher." },
      { titre: 'Créatif', texte: "J'aime imaginer des univers, des mécaniques, des ambiances. Mes projets partent d'une idée qui m'enthousiasme, et ce portfolio en est un exemple." },
      { titre: 'Autodidacte', texte: "J'ai appris Unity, Unreal et Blender surtout seul, par la pratique. Je peux monter sur une techno nouvelle en quelques jours d'effort concentré." },
      { titre: 'Bon coéquipier', texte: "Diopside en équipe, le challenge cybersécurité en binôme avec Fabian : quand le projet a du sens, la collaboration se passe très bien." }
    ]
  },
  faiblesses: {
    emoji: '🌱',
    titre: 'Mes axes de progression',
    sousTitre: 'Ce que je travaille, en toute honnêteté',
    intro: null,
    blocs: [
      { titre: 'Finir avant de rêver plus loin', texte: "Mon côté créatif me fait parfois démarrer trop de projets à la fois. Mes jeux publiés sur Steam et Slurp sur CrazyGames montrent que j'apprends à aller au bout, et je continue à m'entraîner." },
      { titre: 'Communiquer davantage', texte: "Je suis à l'aise en solo. En stage, il m'est arrivé de mal comprendre ce que l'équipe attendait et de partir dans la mauvaise direction. C'est le point que je travaille en priorité." },
      { titre: 'Valoriser mon travail', texte: "J'ai tendance à sous-estimer ce que je produis. Ce portfolio est justement un exercice pour montrer ce que je fais sans le minimiser." },
      { titre: "L'administratif", texte: "Compta, marketing et communication me motivent moins que le code et la 3D. Je le sais, et je m'y mets quand il le faut." }
    ]
  }
};

/* ============== LES 8 ZONES ============== */

export const ZONES_CONTENU = {

  gamedev: {
    titre: 'Game Dev',
    sousTitre: 'Ma deuxième piste',
    badge: '≈ 870 h de pratique',
    intro: "Des projets de tous les formats, du side-scroller 2D au multijoueur 3D, dont trois jeux publiés sur de vraies plateformes : Slurp sur CrazyGames, Somnum et Escape The Brainrots sur Steam. Code, design, 3D, réseau et publication se rejoignent ici.",
    projets: [
      {
        titre: 'Slurp',
        tag: 'Unity 6 | Web | CrazyGames',
        texte: "Mon jeu le plus récent : un jeu de gestion (tycoon) en 3D pour le web, sorti en juillet 2026. Retenu par CrazyGames (1 projet accepté sur 5 proposés), puis passé en Full Launch sur la plateforme. Noté 8,6 sur 10, plus de 11 000 parties jouées et 17 minutes de jeu en moyenne par partie.",
        liens: [{ label: 'Jouer sur CrazyGames', url: 'https://www.crazygames.com/game/slurp' }]
      },
      {
        titre: 'Somnum',
        tag: 'Unreal Engine | Multijoueur | Steam',
        texte: "Jeu d'horreur multijoueur en client/host : les joueurs doivent récupérer de l'énergie sans se faire attraper par le tueur. Plusieurs maps, plusieurs tueurs. Environ 400 heures de travail : gameplay, réseau, optimisation, Steam SDK, page Steam et retours des joueurs.",
        liens: [{ label: 'Voir sur Steam', url: 'https://store.steampowered.com/app/3713850/Somnum/', style: 'steam' }]
      },
      {
        titre: 'Escape The Brainrots',
        tag: 'Unreal Engine | Multijoueur | Steam',
        texte: "Horreur fun multijoueur dans l'esprit des « italian brainrots ». Même exigence que Somnum côté réseau et publication, avec un ton complètement différent. Savoir changer de registre fait partie du métier.",
        liens: [{ label: 'Voir sur Steam', url: 'https://store.steampowered.com/app/3781690/EscapeTheBrainrots/', style: 'steam' }]
      },
      {
        titre: 'Prototypes et jeux persos',
        tag: 'Unity 2D/3D | Web',
        texte: "Bete (3D Unity, ambiance lugubre, avec mes propres assets Blender), TheHunt (top-down avec inventaire et IA ennemie), DinoEarth (idle game de dinosaures), Escape You (puzzle sur grille), MelodyCollector (side-scroller musical). Chaque prototype m'a appris une mécanique ou un format différent.",
        images: [
          '/assets/proofs/gamedev/Bete1.png',
          '/assets/proofs/gamedev/Bete2.webp',
          '/assets/proofs/gamedev/TheHunt.webp',
          '/assets/proofs/gamedev/DinoEarth.webp',
          '/assets/proofs/gamedev/DinoEarth2.webp',
          '/assets/proofs/gamedev/EscapeYou.webp',
          '/assets/proofs/gamedev/escapeYou2.webp',
          '/assets/proofs/gamedev/Jeu2.webp',
          '/assets/proofs/gamedev/Jeu2bis.webp'
        ],
        liens: [
          { label: 'TheHunt (GitHub)', url: 'https://github.com/CryptoGot/TheHunt' },
          { label: 'MelodyCollector (GitHub)', url: 'https://github.com/CryptoGot/MelodyCollector' }
        ]
      },
      {
        titre: 'Formations Unity et Unreal',
        tag: 'Autoformation',
        texte: "Deux formations longues suivies en codant en parallèle : une série Unity 2D (plateformer) et un Third Person Shooter complet sous Unreal (8 h de vidéo, 12 h de pratique). Ce sont elles qui m'ont permis d'attaquer Somnum ensuite.",
        images: [
          '/assets/proofs/gamedev/EntraineemntUity1.webp',
          '/assets/proofs/gamedev/EntrainementUnity2.webp',
          '/assets/proofs/gamedev/EntraineemntUnreal1.webp'
        ],
        liens: [
          { label: 'Code Unity (GitHub)', url: 'https://github.com/CryptoGot/UnityLearn2D' },
          { label: 'Code Unreal TPS (GitHub)', url: 'https://github.com/CryptoGot/Unreal-TPS-Learning' }
        ]
      }
    ],
    competences: ['Unity 2D/3D', 'Unreal Engine (Blueprints)', 'Multijoueur client/host', 'Steam SDK et publication', 'Game design', 'Autoformation'],
    retenir: "Publier un jeu, c'est un métier complet : code, design, page de jeu, trailer, retours des joueurs, debug en production. Mes jeux publiés prouvent que je vais au bout."
  },

  ia: {
    titre: 'IA & Agents',
    sousTitre: 'Des agents utilisés pour de vrai',
    badge: 'Deux stages + un job',
    intro: "Depuis février 2026, je construis des agents IA et des automatisations : deux stages et un job étudiant, sur des produits utilisés pour de vrai. Je développe surtout avec l'IA (Claude Code), et j'ai travaillé avec les modèles d'Anthropic, d'OpenAI et de Google.",
    projets: [
      {
        titre: 'BeaverCode (stage chez The Maul)',
        tag: 'Stage | SaaS | Agents IA',
        texte: "J'ai participé à BeaverCode, un SaaS qui crée des sites et des applications avec l'IA, côté front-end, back-end et base de données Supabase. J'ai construit l'agent qui pose des questions au client qui veut un site pour sa boîte, puis définit son besoin à partir de ses réponses. Le système multi-agent tournait d'abord dans n8n, puis il est passé sur un VPS connecté à Supabase. De la vraie production : de vrais utilisateurs, des coûts d'API et une fiabilité à surveiller.",
        images: ['/assets/proofs/ia/Beaver1.png', '/assets/proofs/ia/Beaver2.png'],
        liens: [{ label: 'beavercode.be', url: 'https://beavercode.be/' }]
      },
      {
        titre: 'Automatisation chez Start it @CBC',
        tag: 'Stage | n8n | Agents IA',
        texte: "Trois mois de stage volontaire dans un accélérateur de startups. J'y ai fait un agent qui lit un pitch deck et rend une analyse structurée de ses forces et de ses faiblesses, et de l'automatisation documentaire dans n8n : chercher des informations dans plusieurs sources et produire des documents prêts à livrer."
      },
      {
        titre: 'Assistants en skills Claude (job étudiant)',
        tag: 'Job étudiant | Claude',
        texte: "Pour une personne rencontrée pendant mon stage, une suite d'assistants personnels : un agent finance qui récupère les factures dans plusieurs boîtes mail, les range dans Google Drive et les suit dans Excel, une veille immobilière, le tri des e-mails et des rappels."
      },
      {
        titre: 'Clu',
        tag: 'Unity 3D | Multijoueur',
        texte: "Cluedo croisé Among Us en 3D, avec un système host/client. Ici, je suis aux commandes et l'IA n'est qu'un assistant. Le contraste avec mes essais où l'IA travaille presque seule est exactement le sujet.",
        images: ['/assets/proofs/ia/Clu1.webp', '/assets/proofs/ia/Clu2.webp']
      },
      {
        titre: 'Le labo : 5 prototypes, plus ou moins supervisés',
        tag: 'Expérimentation',
        texte: "Lumina (beaucoup de supervision, un puzzle qui tient la route), Mixmoji (l'IA cale sur la créativité pure), Cellulia (presque autonome, fonctionnel mais sans âme), Haven (zéro supervision, volontairement injouable), Immunis (tower defense contrôlé et débuggé à la main). Ma conclusion : l'IA est excellente dans un cadre précis et se perd dès qu'il faut inventer.",
        images: [
          '/assets/proofs/ia/Lumina1.webp',
          '/assets/proofs/ia/Lumina2.webp',
          '/assets/proofs/ia/Mixmoji.webp',
          '/assets/proofs/ia/Cellulia1.webp',
          '/assets/proofs/ia/Haven1.webp',
          '/assets/proofs/ia/Immunis1.webp'
        ]
      }
    ],
    competences: ['Agents IA', 'Claude Code', 'API Claude', 'n8n', 'Serveurs MCP', 'Coûts et fiabilité'],
    retenir: "Le développeur devient chef d'orchestre : avec l'IA, j'avance vite, à condition de décider moi-même de ce qui est bon et de vérifier ce qu'elle produit."
  },

  site: {
    titre: 'Web & SaaS',
    sousTitre: "Des produits complets, de l'idée à la mise en ligne",
    badge: '≈ 510 h',
    intro: "Du SaaS de fin d'études au site d'un client : tout ce que je fais a besoin d'une vitrine, d'un compte, d'un déploiement.",
    projets: [
      {
        titre: 'GamAI, mon TFE',
        tag: 'SaaS | Supabase | IA',
        texte: "Un SaaS où l'utilisateur crée son jeu web en discutant avec une IA, le personnalise et gère ses projets. Des agents génèrent les jeux dans des sandboxes cloud. Repris trois fois de zéro pour atteindre la qualité voulue, environ 500 heures. J'y ai appris le produit complet : Supabase (authentification, Row Level Security), DNS et HTTPS, mails transactionnels, upload de fichiers, quotas d'API, séparation entre dev et prod, déploiement. Le site n'est plus en ligne aujourd'hui.",
        images: ['/assets/proofs/site/GamAI.png', '/assets/proofs/site/GamAI2.png']
      },
      {
        titre: 'Villa Sandoria',
        tag: 'Site vitrine | Multilingue',
        texte: "Le site d'une villa de location avec piscine dans le Var, réalisé pour un membre de ma famille : cinq langues (français, néerlandais, anglais, allemand, danois), une galerie, la présentation de la région et une demande de réservation.",
        liens: [{ label: 'villasandoria.com', url: 'https://villasandoria.com/' }]
      },
      {
        titre: 'Formations web',
        tag: 'HTML5 | CSS | JS',
        texte: "Plusieurs formations à distance (HTML5, CSS, JS, programmation, PromoSciences) qui ont posé mes bases : sémantique, modèle de boîte, flexbox et grid, asynchrone. C'est sur ces bases que reposent GamAI, le site Easter Egg et ce portfolio.",
        liens: [
          { label: 'Attestation HTML5', url: '/assets/proofs/formations/HTML5317_Attestation de suivi.pdf' },
          { label: 'Attestation CSS', url: '/assets/proofs/formations/CSS241_Attestation de suivi.pdf' },
          { label: 'Attestation JS/Prog', url: '/assets/proofs/formations/PROGRAM250_Attestation de suivi.pdf' }
        ]
      }
    ],
    competences: ['Front-end', 'Supabase', 'Auth et RLS', 'DNS et déploiement', 'Sécurité web'],
    retenir: "GamAI m'a appris à faire un produit seul, de bout en bout : concevoir, construire, déployer, maintenir, et survivre à mes propres erreurs de prod (clé exposée, auth cassée, coûts qui explosent). Chaque galère est devenue un réflexe."
  },

  app: {
    titre: 'App mobile',
    sousTitre: 'Diopside, projet d’équipe',
    badge: '≈ 60 h',
    intro: null,
    projets: [
      {
        titre: 'Diopside',
        tag: 'Équipe | Unity embarqué',
        texte: "Application pour une marque de vêtements : channels de discussion, avatars 3D personnalisables (Unity intégré dans l'app, ce qui n'est pas trivial), système de récompenses, boutique dont les achats habillent l'avatar. Mon premier vrai travail d'équipe sur du code : branches Git, pull requests, conflits de merge, découpage des tâches. J'y ai compris qu'un code propre n'est pas un luxe quand quelqu'un d'autre doit le relire.",
        liens: [
          { label: 'Vidéo de présentation', url: 'https://www.youtube.com/shorts/U7yy6cHPmjc?feature=share' },
          { label: 'Code source (GitHub)', url: 'https://github.com/Yielloow/Diopside-App' }
        ]
      }
    ],
    competences: ['Unity intégré au mobile', 'Travail d’équipe', 'Git et pull requests', 'UX produit'],
    retenir: "Un produit n'est pas qu'un beau code : sans la vidéo de démo, le projet aurait été invisible. Finir et montrer compte autant que produire."
  },

  design3d: {
    titre: '3D Design',
    sousTitre: 'Mes assets, mon identité visuelle',
    badge: 'Blender',
    intro: null,
    projets: [
      {
        titre: 'Assets 3D pour mes jeux',
        tag: 'Blender | Low-poly',
        texte: "Tous les assets de Bete et de plusieurs prototypes sont modélisés par moi dans Blender, dans une ambiance sombre et lugubre, en low-poly stylisé. Modélisation, bevel, UV mapping, export FBX vers Unity et Unreal. Un asset doit être pensé pour le moteur : polycount raisonnable, pivot bien placé, échelle cohérente. Et surtout, un même niveau de détail partout, sinon ça fait amateur.",
        images: [
          '/assets/proofs/3ddesign/blender1.webp',
          '/assets/proofs/3ddesign/blender2.webp',
          '/assets/proofs/3ddesign/blender3.webp'
        ]
      }
    ],
    competences: ['Blender', 'Low-poly stylisé', 'UV mapping', 'Export FBX et glTF'],
    retenir: "Produire mes propres modèles, c'est une identité visuelle cohérente et aucune dépendance aux asset stores. Je prototype vite, et tout colle."
  },

  electronique: {
    titre: 'Électronique',
    sousTitre: 'Le frigo connecté',
    badge: 'Raspberry Pi',
    intro: null,
    projets: [
      {
        titre: 'Frigo connecté (Raspberry Pi 4)',
        tag: 'Projet perso | Prototype',
        texte: "Un écran tactile sur la porte du frigo qui propose des recettes selon les ingrédients disponibles. Montage complet du matériel, configuration Raspbian, début d'interface web. Projet non terminé, et je l'assume : sans scan automatique des ingrédients, la saisie manuelle tue l'usage. Le défaut était dans la conception de l'expérience, pas dans la technique. Leçon retenue pour tous mes produits depuis.",
        images: [
          '/assets/proofs/electronique/Electronique.webp',
          '/assets/proofs/electronique/ImagesiteFrigo.png'
        ]
      }
    ],
    competences: ['Raspberry Pi', 'Linux', 'Prototypage'],
    retenir: "Un produit doit s'intégrer dans une routine, sinon il finit dans un tiroir. Sa valeur dépend autant de l'usage que de la technique."
  },

  hardware: {
    titre: 'Hardware',
    sousTitre: 'Diagnostics et réparations',
    badge: 'PC',
    intro: null,
    projets: [
      {
        titre: 'Interventions PC',
        tag: 'Diagnostic',
        texte: "Boot en boucle : un câble de données du SSD débranché, identifié et rebranché. Ventilateur CPU bruyant : démontage hors tension, nettoyage, nouvelle pâte thermique. Et un échec lucide : une carte mère défaillante hors de ma portée, où j'ai préféré passer la main avant d'aggraver les choses. Un PC n'est pas une boîte noire, on diagnostique au lieu de paniquer.",
        images: ['/assets/proofs/hardware/HardWare.webp']
      }
    ],
    competences: ['Diagnostic hardware', 'Montage et démontage', 'Autonomie technique'],
    retenir: "Savoir diagnostiquer, et savoir quand s'arrêter, ça sert dans tous les métiers de l'informatique."
  },

  securite: {
    titre: 'Cybersécurité',
    sousTitre: 'Penser comme un attaquant',
    badge: '≈ 15 h',
    intro: null,
    projets: [
      {
        titre: 'Plateforme du challenge Easter Egg (EPHEC)',
        tag: 'React | Vercel | Backend',
        texte: "Avec Fabian, nous avons construit la plateforme officielle du challenge cybersécurité de l'école : les étudiants y soumettent les codes des easter eggs cachés par les profs. Front-end React (Next.js) sur Vercel, validation des codes côté serveur, scoring, historique horodaté. Impossible de se permettre une injection SQL ou un code truquable sur un site... de sécurité : aucune confiance dans les entrées des utilisateurs, toutes les vérifications côté serveur.",
        images: [
          '/assets/proofs/site/SécuritéChallenge.png',
          '/assets/proofs/site/SécuritéChallenge2.png'
        ],
        liens: [{ label: 'Le site du challenge', url: 'https://easter-egg-2025-git-main-lannoyes-projects.vercel.app/' }]
      }
    ],
    competences: ['Sécurité web', 'React', 'Validation côté serveur', 'Travail en binôme'],
    retenir: "Une faille, c'est une réputation ruinée et des données compromises. Je garde une hygiène de sécurité minimale dans tout ce que je publie : BeaverCode, GamAI, mes jeux."
  }
};
