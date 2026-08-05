/* =============================================================
   Contenu du portfolio — ton professionnel, première personne
   (Les textes d'origine EPHEC ont été condensés et réorientés
   recherche d'emploi. Les preuves/images viennent de public/assets.)
============================================================= */

export const PROFILE = {
  nom: 'Aurélien Lannoye',
  role: 'Game Developer',
  sousRole: 'Unity · Unreal Engine · Blender · Web',
  liens: [
    { id: 'github', emoji: '💻', label: 'GitHub', url: 'https://github.com/CryptoGot?tab=repositories' },
    { id: 'linkedin', emoji: '💼', label: 'LinkedIn', url: 'https://www.linkedin.com/in/aurelien-lannoye-05218940a/' },
    { id: 'mail', emoji: '✉️', label: 'aurlannoye@gmail.com', url: 'mailto:aurlannoye@gmail.com' },
    { id: 'cv', emoji: '📄', label: 'Mon CV (PDF)', url: '/docs/CV_2025-10-05_Aurelien_Lannoye.pdf' },
    { id: 'cv-en', emoji: '📄', label: 'CV in English (PDF)', url: '/docs/CV_2025-10-05_Aurelien_Lannoye-AnglaisCorrigé.pdf' }
  ]
};

/* ============== LES 3 COFFRES (à propos de moi) ============== */

export const COFFRES = {
  projet: {
    emoji: '🎯',
    titre: 'Mon projet pro',
    sousTitre: 'Là où je vais',
    intro: "Devenir game developer indépendant : créer mes propres jeux de la conception à la publication, et en vivre — en alternant projets persos et collaborations choisies.",
    liste: [
      'Continuer à publier sur Steam (Somnum et Escape The Brainrots sont déjà en ligne)',
      'Approfondir Unreal Engine et le multijoueur client/host',
      'Maîtriser la chaîne complète : code, 3D, son, publication',
      'Rejoindre un studio ou une équipe qui crée des jeux pour monter en niveau',
      'Lancer ma structure d’indépendant à terme'
    ]
  },
  forces: {
    emoji: '💪',
    titre: 'Mes forces',
    sousTitre: 'Ce que j’apporte',
    intro: null,
    blocs: [
      { titre: 'Passionné', texte: "Quand un projet me prend, j'y consacre des journées entières. Somnum et Escape The Brainrots m'ont demandé environ 400 heures chacun, sur trois mois, sans lâcher." },
      { titre: 'Créatif', texte: "J'aime imaginer des univers, des mécaniques, des ambiances. Mes projets partent d'une idée qui m'enthousiasme — ce portfolio en est un exemple." },
      { titre: 'Autodidacte', texte: "J'ai appris Unity, Unreal et Blender principalement seul, par la pratique. Je peux monter sur une techno nouvelle en quelques jours d'effort concentré." },
      { titre: 'Bon coéquipier', texte: "Diopside en équipe, le challenge cybersécurité en pair programming avec Fabian : quand le projet a du sens, la collaboration se passe très bien." }
    ]
  },
  faiblesses: {
    emoji: '🌱',
    titre: 'Mes axes de progression',
    sousTitre: 'Ce que je travaille — en toute honnêteté',
    intro: null,
    blocs: [
      { titre: 'Finir avant de rêver plus loin', texte: "Mon côté créatif me fait parfois démarrer trop de projets à la fois. Mes deux jeux Steam publiés sont ma preuve que j'apprends à aller au bout — et je continue à m'entraîner." },
      { titre: "M'ouvrir davantage", texte: "Je suis à l'aise en solo, ce qui peut me limiter quand il faut déléguer ou demander de l'aide. Je cherche activement plus de collaborations pour progresser là-dessus." },
      { titre: 'Valoriser mon travail', texte: "J'ai tendance à sous-estimer ce que je produis. Ce portfolio est justement un exercice pour montrer ce que je fais sans le minimiser." },
      { titre: "L'administratif", texte: "Compta, marketing, communication me motivent moins que le code et la 3D. Un vrai défi pour un futur indé — je le sais et je m'y forme." }
    ]
  }
};

/* ============== LES 8 ZONES ============== */

export const ZONES_CONTENU = {

  gamedev: {
    titre: 'Game Dev',
    sousTitre: 'Le cœur de mon métier',
    badge: '≈ 870 h de pratique',
    intro: "Sept projets, tous les formats — du side-scroller 2D au multijoueur 3D — dont deux jeux publiés sur Steam. C'est ici que tout converge : code, design, 3D, réseau, publication.",
    projets: [
      {
        titre: 'Somnum',
        tag: 'Unreal Engine · Multijoueur · Steam',
        texte: "Jeu d'horreur multijoueur en client/host : les joueurs doivent récupérer de l'énergie sans se faire attraper par le tueur. Plusieurs maps, plusieurs tueurs. ~400 h de travail : gameplay, réseau, optimisation, Steam SDK, page store et retours joueurs.",
        liens: [{ label: 'Voir sur Steam', url: 'https://store.steampowered.com/app/3713850/Somnum/', style: 'steam' }]
      },
      {
        titre: 'Escape The Brainrots',
        tag: 'Unreal Engine · Multijoueur · Steam',
        texte: "Horreur fun multijoueur dans l'esprit des « italian brainrots ». Même exigence que Somnum côté réseau et publication, avec un ton complètement différent — savoir changer de registre fait partie du métier.",
        liens: [{ label: 'Voir sur Steam', url: 'https://store.steampowered.com/app/3781690/EscapeTheBrainrots/', style: 'steam' }]
      },
      {
        titre: 'Prototypes & jeux persos',
        tag: 'Unity 2D/3D · Web',
        texte: "Bete (3D Unity, ambiance lugubre, avec mes propres assets Blender), TheHunt (top-down avec inventaire et IA à la Fear and Hunger), DinoEarth (idle game de dinosaures), Escape You (puzzle sur grille), MelodyCollector (side-scroller musical). Chaque prototype m'a appris une mécanique ou un format différent.",
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
        titre: 'Formations Unity & Unreal',
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
    competences: ['Unreal Engine', 'Unity 2D/3D', 'Multijoueur client/host', 'Steam SDK & publication', 'Game design', 'Autoformation'],
    retenir: "Publier un jeu, c'est un métier complet : code, design, page store, trailer, retours joueurs, debug en production. Mes deux jeux Steam prouvent que je vais au bout."
  },

  ia: {
    titre: 'IA & Agents',
    sousTitre: "L'IA comme accélérateur piloté",
    badge: '≈ 250 h',
    intro: "J'ai testé les limites de l'IA générative en la laissant plus ou moins libre sur de vrais projets — et je l'utilise aujourd'hui en production.",
    projets: [
      {
        titre: 'Beavercode',
        tag: 'Stage · SaaS · Agents IA',
        texte: "SaaS de création de sites où j'ai construit l'essentiel du produit pendant mon stage (~200 h) : notamment des agents IA conversationnels qui interrogent l'utilisateur pour comprendre son besoin. De la vraie production : utilisateurs réels, coûts d'API à maîtriser, fiabilité.",
        images: ['/assets/proofs/ia/Beaver1.png', '/assets/proofs/ia/Beaver2.png'],
        liens: [{ label: 'beavercode.be', url: 'https://beavercode.be/' }]
      },
      {
        titre: 'Clu',
        tag: 'Unity 3D · Multijoueur',
        texte: "Cluedo croisé Among Us en 3D avec système host/client. Ici je suis aux commandes et l'IA n'est qu'un assistant — le contraste avec mes expériences « IA en autonomie » est exactement le sujet.",
        images: ['/assets/proofs/ia/Clu1.webp', '/assets/proofs/ia/Clu2.webp']
      },
      {
        titre: 'Le labo : 5 prototypes à supervision variable',
        tag: 'Expérimentation',
        texte: "Lumina (supervision forte → un puzzle qui tient la route), Mixmoji (l'IA cale sur la créativité pure), Cellulia (quasi autonome → fonctionnel mais sans âme), Haven (zéro supervision → volontairement injouable), Immunis (tower defense contrôlé et débuggé à la main). Conclusion assumée : l'IA excelle dans un cadre précis, se perd en invention pure.",
        images: [
          '/assets/proofs/ia/Lumina1.webp',
          '/assets/proofs/ia/Lumina2.webp',
          '/assets/proofs/ia/Mixmoji.webp',
          '/assets/proofs/ia/Cellulia1.webp',
          '/assets/proofs/ia/Haven1.webp',
          '/assets/proofs/ia/Immunis1.webp'
        ],
        liens: [
          { label: 'Lumina (itch.io)', url: 'https://crrryyy.itch.io/lumina' },
          { label: 'Mixmoji (itch.io)', url: 'https://crrryyy.itch.io/mixmoji' },
          { label: 'Cellulia (itch.io)', url: 'https://crrryyy.itch.io/cellulia' }
        ]
      }
    ],
    competences: ['Agents IA', 'Claude Code', 'Prompt engineering', 'Intégration API IA', 'Maîtrise des coûts'],
    retenir: "Le dev devient chef d'orchestre : je peux produire à la vitesse d'une équipe, à condition de garder le pilotage. C'est moi qui définis ce qui est bon."
  },

  site: {
    titre: 'Web & SaaS',
    sousTitre: 'Des produits complets, en ligne',
    badge: '≈ 510 h',
    intro: "Du SaaS en production aux fondations du web — tout ce que je publie a besoin d'une vitrine, d'un compte, d'un dashboard.",
    projets: [
      {
        titre: 'GamAI — mon TFE',
        tag: 'SaaS · Supabase · IA',
        texte: "Un SaaS où l'utilisateur crée son jeu web en discutant avec une IA, le personnalise et gère ses projets. Repris trois fois de zéro pour atteindre la qualité voulue (~500 h). J'y ai appris le produit complet : Supabase (auth, Row Level Security), DNS et HTTPS, mails transactionnels, upload de fichiers, quotas d'API, séparation dev/prod, déploiement.",
        images: ['/assets/proofs/site/GamAI.png', '/assets/proofs/site/GamAI2.png'],
        liens: [{ label: 'gamai.app', url: 'https://gamai.app/' }]
      },
      {
        titre: 'Formations web',
        tag: 'HTML5 · CSS · JS',
        texte: "Plusieurs formations à distance (HTML5, CSS, JS, programmation, PromoSciences) qui ont posé mes fondations : sémantique, modèle de boîte, flexbox/grid, asynchrone. C'est sur ces bases que reposent GamAI, le site Easter Egg et ce portfolio.",
        liens: [
          { label: 'Attestation HTML5', url: '/assets/proofs/formations/HTML5317_Attestation de suivi.pdf' },
          { label: 'Attestation CSS', url: '/assets/proofs/formations/CSS241_Attestation de suivi.pdf' },
          { label: 'Attestation JS/Prog', url: '/assets/proofs/formations/PROGRAM250_Attestation de suivi.pdf' }
        ]
      }
    ],
    competences: ['Frontend', 'Supabase', 'Auth & RLS', 'DNS / déploiement', 'Sécurité web'],
    retenir: "GamAI m'a appris à faire un produit seul, de bout en bout : concevoir, builder, déployer, maintenir — et survivre à mes propres erreurs de prod (clé exposée, auth cassée, coûts qui explosent : chaque galère est devenue un réflexe)."
  },

  app: {
    titre: 'App mobile',
    sousTitre: 'Diopside — projet d’équipe',
    badge: '≈ 60 h',
    intro: null,
    projets: [
      {
        titre: 'Diopside',
        tag: 'Équipe · Unity embarqué',
        texte: "Application pour une marque de vêtements : channels de discussion, avatars 3D personnalisables (Unity intégré dans l'app — pas trivial), système de récompenses, boutique dont les achats habillent l'avatar. Mon premier vrai travail d'équipe sur du code : branches Git, pull requests, conflits de merge, découpage des tâches. J'y ai compris qu'un code propre n'est pas un luxe quand quelqu'un d'autre doit le relire.",
        liens: [
          { label: 'Vidéo de présentation', url: 'https://www.youtube.com/shorts/U7yy6cHPmjc?feature=share' },
          { label: 'Code source (GitHub)', url: 'https://github.com/Yielloow/Diopside-App' }
        ]
      }
    ],
    competences: ['Intégration Unity ↔ mobile', 'Travail d’équipe', 'Git & pull requests', 'UX produit'],
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
        tag: 'Blender · Low-poly',
        texte: "Tous les assets de Bete et de plusieurs prototypes sont modélisés par moi dans Blender — ambiance sombre et lugubre, low-poly stylisé. Modélisation, bevel, UV mapping, export FBX vers Unity/Unreal. Un asset doit être pensé pour le moteur : polycount raisonnable, pivot bien placé, échelle cohérente. Et surtout : un même niveau de détail partout, sinon ça fait amateur.",
        images: [
          '/assets/proofs/3ddesign/blender1.webp',
          '/assets/proofs/3ddesign/blender2.webp',
          '/assets/proofs/3ddesign/blender3.webp'
        ]
      }
    ],
    competences: ['Blender', 'Low-poly stylisé', 'UV mapping', 'Export FBX / glTF'],
    retenir: "Produire mes propres modèles = une identité visuelle cohérente et zéro dépendance aux asset stores. Je prototype vite, et tout colle."
  },

  electronique: {
    titre: 'Électronique',
    sousTitre: 'Le frigo connecté',
    badge: 'Raspberry Pi',
    intro: null,
    projets: [
      {
        titre: 'Frigo connecté (Raspberry Pi 4)',
        tag: 'Projet perso · Prototype',
        texte: "Un écran tactile sur la porte du frigo qui propose des recettes selon les ingrédients disponibles. Montage complet du matériel, configuration Raspbian, début d'interface web. Projet non terminé — et j'assume : sans scan automatique des ingrédients, la saisie manuelle tue l'usage. Le défaut était dans la conception de l'expérience, pas dans la technique. Leçon retenue pour tous mes produits depuis.",
        images: [
          '/assets/proofs/electronique/Electronique.webp',
          '/assets/proofs/electronique/ImagesiteFrigo.png'
        ]
      }
    ],
    competences: ['Raspberry Pi', 'Linux', 'Prototypage'],
    retenir: "Un produit doit s'intégrer dans une routine, sinon il finit dans un tiroir. La valeur dépend autant de l'usage que de la technique."
  },

  hardware: {
    titre: 'Hardware',
    sousTitre: 'Diagnostics & réparations',
    badge: 'PC',
    intro: null,
    projets: [
      {
        titre: 'Interventions PC',
        tag: 'Diagnostic',
        texte: "Boot en boucle → câble de données SSD débranché, identifié et rebranché. Ventilateur CPU bruyant → démontage hors tension, nettoyage, réapplication de pâte thermique. Et un échec lucide : une carte mère défaillante hors de ma portée, où j'ai préféré passer la main avant d'aggraver. Un PC n'est pas une boîte noire : on diagnostique au lieu de paniquer.",
        images: ['/assets/proofs/hardware/HardWare.webp']
      }
    ],
    competences: ['Diagnostic hardware', 'Montage / démontage', 'Autonomie technique'],
    retenir: "Comme indé je serai mon propre support technique. Savoir diagnostiquer — et savoir quand s'arrêter — fait partie du métier."
  },

  securite: {
    titre: 'Cybersécurité',
    sousTitre: 'Penser comme un attaquant',
    badge: '≈ 15 h',
    intro: null,
    projets: [
      {
        titre: 'Plateforme du challenge Easter Egg (EPHEC)',
        tag: 'React · Vercel · Backend',
        texte: "Avec Fabian, nous avons construit la plateforme officielle du challenge cybersécurité de l'école : les étudiants y soumettent les codes des easter eggs cachés par les profs. Frontend React sur Vercel, backend avec validation des codes côté serveur, scoring, historique horodaté. Impossible de se permettre une injection SQL ou un code truquable sur un site... de sécurité : zéro confiance aux entrées utilisateur, toutes les vérifications côté serveur.",
        images: [
          '/assets/proofs/site/SécuritéChallenge.png',
          '/assets/proofs/site/SécuritéChallenge2.png'
        ],
        liens: [{ label: 'Le site du challenge', url: 'https://easter-egg-2025-git-main-lannoyes-projects.vercel.app/' }]
      }
    ],
    competences: ['Sécurité web', 'React', 'Validation côté serveur', 'Pair programming'],
    retenir: "Une faille, c'est une réputation ruinée et des données compromises. Je garde une hygiène sécurité minimale dans tout ce que je publie — Beavercode, GamAI, mes jeux."
  }
};
