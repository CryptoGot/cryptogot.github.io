/* =============================================================
   Données du portfolio : 8 thèmes EPHEC
   Chaque thème = un environnement top-down avec pancarte(s)
   Les analyses réflexives sont rédigées à la première personne
============================================================= */

window.PORTFOLIO = {

  /* ============== INFOS GÉNÉRALES ============== */
  identite: {
    nom: "Aurélien Lannoye",
    parcours: "Bac 3 Technologies de l'Informatique, EPHEC Louvain-la-Neuve",
    projetPro: "Devenir game developer indépendant et continuer à créer mes propres projets de jeux vidéo, de la conception à la publication. Je veux pouvoir vivre de mes créations sans dépendre d'un studio, en alternant projets persos et collaborations choisies.",
    objectifs: [
      "Continuer à publier des jeux sur Steam (Somnum et Escape The Brainrots sont déjà en ligne)",
      "Approfondir Unreal Engine et le multijoueur client/host",
      "Maîtriser la chaîne complète : code, 3D, son, publication",
      "Trouver un stage de fin d'études dans un studio ou une boîte qui crée des jeux",
      "Lancer ma structure d'indépendant à terme"
    ],
    forces: [
      { titre: "Passionné", texte: "Quand un projet me prend, j'y consacre des journées entières. Somnum et Escape The Brainrots m'ont demandé environ 400 heures chacun, étalées sur trois mois, et je n'ai pas lâché." },
      { titre: "Créatif et rêveur", texte: "J'aime imaginer des univers, des mécaniques, des ambiances. La plupart de mes projets partent d'une idée que je trouve intéressante avant même de penser à la rentabilité." },
      { titre: "Agréable et ouvert", texte: "Je travaille bien en groupe quand le projet a du sens. J'ai collaboré sur Diopside avec une équipe et sur le challenge de cybersécurité avec Fabian, ça s'est très bien passé." },
      { titre: "Autodidacte", texte: "J'ai appris Unity, Unreal et Blender principalement seul, via des formations YouTube et la pratique. Je n'attends pas qu'on m'enseigne pour avancer." }
    ],
    faiblesses: [
      { titre: "Solitaire", texte: "Je préfère souvent travailler seul, ce qui est confortable mais peut me limiter quand il faut déléguer ou demander de l'aide. C'est un point que je veux améliorer en m'ouvrant davantage aux collaborations." },
      { titre: "Le rêveur peut basculer", texte: "Mon côté créatif est aussi mon défaut : je commence parfois trop de projets en même temps et certains restent inachevés. Il faut que j'apprenne à finir avant d'aller voir ailleurs." },
      { titre: "Difficulté à valoriser mon travail", texte: "Je sous-estime souvent ce que je produis. Présenter mon portfolio est un exercice où je dois apprendre à montrer ce que j'ai fait sans le minimiser." },
      { titre: "Procrastination sur l'administratif", texte: "Le code, la 3D, le game design me passionnent. Les démarches autour (compta, marketing, communication) me motivent moins, ce qui est un vrai défi pour quelqu'un qui veut être indépendant." }
    ]
  },

  /* ============== 1. 3D DESIGN (FORÊT) ============== */
  design3d: {
    id: "design3d",
    titre: "3D Design",
    sousTitre: "Création d'assets dans Blender",
    environnement: "foret",
    heuresValorisees: 5,
    heuresReelles: 20,
    couleurAccent: "#3a7a3a",
    panneaux: [
      {
        type: "projet",
        titre: "Assets 3D pour mes jeux",
        heures: 20,
        valorisation: 5,
        description: "Tous les assets 3D que j'ai utilisés dans Bete et dans plusieurs prototypes ont été modélisés par moi-même dans Blender. Ambiance volontairement sombre et lugubre, low-poly stylisé.",
        screenshots: [
          "assets/proofs/3ddesign/blender1.webp",
          "assets/proofs/3ddesign/blender2.webp",
          "assets/proofs/3ddesign/blender3.webp"
        ],
        liens: [],
        analyseReflexive: `J'ai commencé Blender parce que je ne voulais pas dépendre des assets que l'on trouve sur les stores Unity ou Unreal. Quand je crée un jeu avec une ambiance précise en tête, comme Bete qui devait être lugubre et oppressant, les assets génériques cassent l'identité visuelle. J'avais besoin de pouvoir produire mes propres modèles, même simples, pour que tout colle.

Concrètement, j'ai passé plus de vingt heures dans Blender à apprendre les bases : la modélisation par extrusion, le bevel, l'UV mapping basique, l'export en FBX vers Unity et Unreal. J'ai d'abord suivi quelques tutos puis je suis passé à la pratique directe sur mes propres besoins. La courbe d'apprentissage est rude au début, surtout les raccourcis clavier, mais une fois passé ce mur initial le logiciel devient un vrai outil de création.

Ce que j'ai surtout appris, c'est qu'un asset 3D ne sert pas qu'à exister dans la scène : il doit être pensé pour le moteur (nombre de polygones raisonnable, pivot point bien placé, échelle cohérente avec le reste). Quand on importe mal, tout casse. J'ai aussi compris l'importance de la cohérence stylistique : tous mes assets pour un même jeu doivent avoir le même niveau de détail, sinon ça fait amateur.

Pour mon projet professionnel de game dev indépendant, savoir produire mes propres modèles est un atout énorme. Ça réduit ma dépendance à des prestataires ou à des packs payants, ça me permet d'itérer vite quand je veux tester une idée visuelle, et ça renforce l'identité de chaque jeu. Je ne deviendrai pas un grand modeleur 3D, ce n'est pas mon métier principal, mais je veux maintenir un niveau qui me permet de prototyper et de finir un projet sans bloquer.

J'ai valorisé cette activité à 5 heures car même si j'y ai passé bien plus de temps réel, l'apprentissage formel sur Blender représente une partie de ce volume, le reste étant de la production d'assets pour mes jeux (déjà comptabilisée dans les thèmes correspondants).`
      }
    ]
  },

  /* ============== 2. APP (VILLE) ============== */
  app: {
    id: "app",
    titre: "Application mobile",
    sousTitre: "Diopside, projet de groupe EPHEC",
    environnement: "ville",
    heuresValorisees: 10,
    heuresReelles: 60,
    couleurAccent: "#5a7a9a",
    panneaux: [
      {
        type: "projet",
        titre: "Diopside, application pour une marque de vêtements",
        heures: 60,
        valorisation: 10,
        description: "Application développée en équipe à l'EPHEC pour une marque de vêtements fictive. Channels de discussion, création et personnalisation d'avatars 3D via Unity intégré, gestion de compte avec système de récompenses, achats de pulls qui personnalisent l'avatar.",
        screenshots: [],
        liens: [
          { label: "Vidéo de présentation (YouTube)", url: "https://www.youtube.com/shorts/U7yy6cHPmjc?feature=share" },
          { label: "Code source GitHub", url: "https://github.com/Yielloow/Diopside-App" }
        ],
        analyseReflexive: `Diopside est un projet de groupe que nous avons mené en deuxième année à l'EPHEC. Il s'agissait de concevoir une application complète pour une marque de vêtements fictive, mais avec une vraie ambition : ce n'était pas juste un catalogue, on voulait y intégrer une dimension sociale et un côté gamifié.

L'application combine plusieurs briques : des channels de discussion entre utilisateurs, un système de création et de personnalisation d'avatar 3D développé sous Unity et embarqué dans l'app, une gestion de compte avec système de récompenses, et une boutique de pulls qui modifient directement l'avatar de l'utilisateur. Le défi technique principal était l'intégration entre l'app mobile et Unity, ce qui n'est pas trivial.

J'y ai consacré environ soixante heures réparties sur la durée du projet. C'est ma première expérience sérieuse de travail en équipe sur du code, avec gestion de branches Git, revues de pull requests et résolution de conflits de merge. J'ai vite compris qu'écrire du code propre n'est pas un luxe quand quelqu'un d'autre doit le relire ou l'utiliser. J'ai aussi appris à découper une fonctionnalité en tâches que l'on peut se répartir, ce qui est un exercice de communication autant que de technique.

Sur le plan technique j'ai approfondi mes connaissances en intégration multi-plateformes, en gestion d'état dans une application avec utilisateurs persistants, et en synchronisation entre différents systèmes (la partie 3D Unity et l'app principale ne parlaient pas le même langage au départ).

Pour mon projet professionnel de développeur indépendant, ce projet m'a appris quelque chose d'essentiel : un produit n'est pas qu'un beau code. Il faut aussi une vraie expérience utilisateur, une cohérence entre les modules, et un travail de présentation. La vidéo de démo a demandé du temps mais sans elle le projet aurait été invisible. Je retiens cette leçon pour mes futurs jeux : finir et montrer compte autant que produire.

Je valorise ce thème à 10 heures sur les 60 réellement passées, car la consigne plafonne à 10 heures par thème.`
      }
    ]
  },

  /* ============== 3. GAME DEV (PLAINE) ============== */
  gamedev: {
    id: "gamedev",
    titre: "Développement de jeux",
    sousTitre: "Le cœur de mon projet professionnel",
    environnement: "plaine",
    heuresValorisees: 10,
    heuresReelles: 870,
    couleurAccent: "#7eb84a",
    panneaux: [
      {
        type: "projet",
        titre: "Mes projets de jeux (Unity, Unreal, Web)",
        heures: 870,
        valorisation: 10,
        description: "Sept projets de jeux de tailles variées, dont deux publiés sur Steam : Somnum (jeu d'horreur multijoueur) et Escape The Brainrots (horreur fun multijoueur). Plus des prototypes en Unity 2D/3D, en WebGL et un projet d'inventaire top-down inspiré de Fear and Hunger.",
        screenshots: [
          "assets/proofs/gamedev/Bete1.png",
          "assets/proofs/gamedev/Bete2.webp",
          "assets/proofs/gamedev/EscapeYou.webp",
          "assets/proofs/gamedev/escapeYou2.webp",
          "assets/proofs/gamedev/DinoEarth.webp",
          "assets/proofs/gamedev/DinoEarth2.webp",
          "assets/proofs/gamedev/TheHunt.webp",
          "assets/proofs/gamedev/Jeu2.webp",
          "assets/proofs/gamedev/Jeu2bis.webp"
        ],
        liens: [
          { label: "Somnum sur Steam", url: "https://store.steampowered.com/app/3713850/Somnum/" },
          { label: "Escape The Brainrots sur Steam", url: "https://store.steampowered.com/app/3781690/EscapeTheBrainrots/" },
          { label: "TheHunt (GitHub)", url: "https://github.com/CryptoGot/TheHunt" },
          { label: "MelodyCollector / Jeu2 (GitHub)", url: "https://github.com/CryptoGot/MelodyCollector" }
        ],
        analyseReflexive: `Le développement de jeux est ma vraie passion et c'est ce que je veux faire de ma vie. J'ai accumulé une diversité de projets qui couvrent à peu près tous les formats : 2D side scroller (Jeu2 inspiré d'un format plateforme musicale), 2D top down (TheHunt, prototype d'inventaire et d'IA dans la lignée de Fear and Hunger), 2D grid (Escape You, jeu de blocage d'animaux), idle game (DinoEarth, collection de dinosaures pour parc), 3D Unity (Bete, jeu de paris sportifs en ambiance lugubre), et 3D Unreal multijoueur (Somnum et Escape The Brainrots, tous deux publiés sur Steam).

Les deux jeux Steam représentent mon investissement le plus lourd : environ 400 heures chacun, étalés sur trois mois. Somnum est un jeu d'horreur en client/host où des joueurs doivent récupérer de l'énergie sans se faire attraper par un tueur, avec plusieurs maps et plusieurs tueurs. Escape The Brainrots est plus orienté fun horreur, dans l'esprit du meme italien des "italian brainrots", toujours en multijoueur. Ces deux jeux m'ont confronté à la réalité de la publication : Steam SDK, build pipeline, gestion des sessions multijoueurs, équilibrage entre client et host, optimisation du réseau.

Ce que j'ai appris dépasse largement le code. Publier un jeu c'est aussi l'écrire dans une page Steam (description, captures, trailer), gérer les retours, débugger en production. C'est un métier complet qui mêle code, design, communication et persévérance. J'ai aussi compris à quel point finir un jeu est dur : sur sept projets cités ici, plusieurs sont restés inachevés. Bete et TheHunt par exemple ont des bases solides mais je suis passé à autre chose avant de les terminer. C'est exactement la faiblesse que j'identifie chez moi (le rêveur qui démarre plus de choses qu'il n'en finit) et je m'entraîne à mieux la gérer.

Pour mon projet pro d'indé, cette accumulation de projets est ma matière première : chaque erreur faite sur Bete m'a évité de la refaire sur Somnum, chaque mécanique ratée m'a appris ce qui fonctionne. Mes deux jeux Steam sont une preuve concrète que je peux aller jusqu'au bout. J'ai valorisé ce thème au plafond de 10 heures car c'est le maximum autorisé par thème, mais le temps réel investi dépasse les 800 heures cumulées.`
      },
      {
        type: "formation",
        titre: "Formations YouTube Unity et Unreal",
        heures: 19,
        valorisation: 10,
        description: "Deux formations vidéo suivies en autonomie pour acquérir les bases : une série Unity 2D (style Mario plateformer) et une formation Unreal Engine TPS de 8h vidéo (12h en réel pour suivre).",
        screenshots: [
          "assets/proofs/gamedev/EntraineemntUity1.webp",
          "assets/proofs/gamedev/EntrainementUnity2.webp",
          "assets/proofs/gamedev/EntraineemntUnreal1.webp"
        ],
        liens: [
          { label: "Formation Unity 2D (YouTube)", url: "https://www.youtube.com/watch?v=xCGwBvoy4So" },
          { label: "Code Unity (GitHub)", url: "https://github.com/CryptoGot/UnityLearn2D" },
          { label: "Formation Unreal TPS (YouTube)", url: "https://www.youtube.com/watch?v=hn98tbztoBg" },
          { label: "Code Unreal TPS (GitHub)", url: "https://github.com/CryptoGot/Unreal-TPS-Learning" }
        ],
        analyseReflexive: `Avant de me lancer sur mes propres projets, j'ai voulu poser des bases solides via deux formations YouTube longues, suivies en autonomie complète. C'est ma manière préférée d'apprendre : un formateur qui code en direct, et moi qui code en parallèle dans mon propre projet, sans copier mais en adaptant.

La première formation porte sur Unity 2D. Il s'agit d'une série de 10 vidéos d'environ 15 minutes chacune où l'on construit un side scroller dans l'esprit Mario. J'y ai appris les bases du moteur : les GameObjects, les composants, les rigidbodies 2D, l'animator, les tilemaps, la gestion des inputs et des collisions. Cette formation est le point de départ de tout ce qui a suivi en Unity, car les concepts qu'on y voit se retrouvent partout. Je l'ai mise en pratique immédiatement dans Escape You et Jeu2.

La seconde formation est plus lourde : huit heures de vidéo Unreal Engine pour construire un Third Person Shooter complet. En pratique j'ai mis environ douze heures à la suivre car on s'arrête souvent pour debugger ou refaire un passage. C'est elle qui m'a donné les bases d'Unreal : les Blueprints, les classes Pawn et Character, le Game Mode, les animations, les colliders, le système d'input. Sans cette formation je n'aurais jamais pu attaquer Somnum, qui est mon projet le plus ambitieux à ce jour.

Ce que je retire de ces deux formations c'est qu'apprendre par la vidéo est efficace si on code en parallèle. Regarder passivement ne sert à rien : il faut taper le code soi-même, casser le projet pour comprendre, lire la doc des classes utilisées. Je le fais systématiquement maintenant.

Pour mon projet professionnel d'indé, savoir s'auto-former est non négociable. Les moteurs évoluent, les outils changent, et personne ne va me payer pour aller en formation. Ces deux expériences m'ont confirmé que je peux apprendre une techno nouvelle en quelques jours d'effort concentré, ce qui est rassurant pour la suite. Je valorise les deux formations à 10 heures cumulées au total (plafond du thème), pour environ 19 heures réellement investies.`
      }
    ]
  },

  /* ============== 4. ÉLECTRONIQUE (MARAIS) ============== */
  electronique: {
    id: "electronique",
    titre: "Électronique",
    sousTitre: "Frigo connecté, projet personnel",
    environnement: "marais",
    heuresValorisees: 5,
    heuresReelles: 8,
    couleurAccent: "#5a6a3a",
    panneaux: [
      {
        type: "projet",
        titre: "Frigo connecté avec Raspberry Pi 4",
        heures: 8,
        valorisation: 5,
        description: "Projet personnel non terminé : monter un écran tactile sur la porte du frigo, relié à un Raspberry Pi 4, qui propose des recettes en fonction des ingrédients présents dans le frigo. Achat du matériel, câblage, début de la page d'affichage.",
        screenshots: [
          "assets/proofs/electronique/Electronique.webp",
          "assets/proofs/electronique/ImagesiteFrigo.png"
        ],
        liens: [],
        analyseReflexive: `J'ai eu cette idée en vidant mon frigo pour la énième fois sans savoir quoi cuisiner avec ce qui restait. L'idée : un écran sur la porte du frigo qui me propose des recettes en fonction de ce que j'ai déclaré comme ingrédients. Côté technique, un Raspberry Pi 4 derrière l'écran, une page web qui interroge une base de recettes, et idéalement à terme une lecture de codes-barres ou une reconnaissance d'image pour automatiser l'inventaire.

J'ai commandé le matériel : Raspberry Pi 4, écran tactile compatible, câbles d'alimentation, supports. J'ai monté le système, l'ai démarré, configuré Raspbian. J'ai aussi commencé à coder la page web qui afficherait les recettes en local, en HTML/CSS/JS basique pour aller vite.

Ce que j'ai appris c'est que l'électronique grand public est devenue très accessible. On peut monter un système connecté sans être ingénieur en électronique, juste en suivant la doc et en câblant proprement. Le Raspberry Pi est un petit ordinateur complet, pas un microcontrôleur comme l'Arduino, donc une fois Linux installé on retombe sur du dev classique. C'est rassurant pour quelqu'un comme moi qui vient du logiciel.

J'ai aussi compris les limites de mon idée. Sans système de scan automatique, je devrais déclarer manuellement chaque ingrédient à chaque course, ce que je ne ferais jamais en pratique. Le projet souffrait d'un défaut de conception sur l'expérience utilisateur, pas sur la technique. C'est une leçon importante : un produit doit être pensé pour s'intégrer dans une routine, sinon il finit dans un tiroir.

Le projet n'est pas terminé, c'est honnête de l'écrire. Il rejoint la liste de mes projets que j'ai commencés sans aller au bout, ce qui correspond à ma faiblesse identifiée. Mais j'en retire deux choses utiles pour mon parcours d'indé : d'abord la confirmation que je peux aborder le hardware sans bloquer, ensuite le rappel que la valeur d'un produit dépend autant de l'usage que de la technique.

Je valorise ce thème à 5 heures sur les 8 réelles, car la partie achat et configuration matérielle ne relève pas strictement de l'apprentissage technique.`
      }
    ]
  },

  /* ============== 5. HARDWARE (MONTAGNE) ============== */
  hardware: {
    id: "hardware",
    titre: "Hardware",
    sousTitre: "Réparations PC",
    environnement: "montagne",
    heuresValorisees: 5,
    heuresReelles: 5,
    couleurAccent: "#7a7a8a",
    panneaux: [
      {
        type: "projet",
        titre: "Diagnostics et réparations PC",
        heures: 5,
        valorisation: 5,
        description: "Plusieurs interventions sur mon propre PC et celui de ma mère : démontage, identification d'un câble débranché, nettoyage et démontage du ventilateur bruyant, tentative de réparation sur une autre machine.",
        screenshots: [
          "assets/proofs/hardware/HardWare.webp"
        ],
        liens: [],
        analyseReflexive: `J'ai eu plusieurs occasions de mettre les mains dans une tour ces derniers mois. La première fois mon PC bootait en boucle sans afficher l'OS. J'ai ouvert la machine, identifié visuellement les composants et les nappes, et j'ai trouvé qu'un câble de données s'était débranché du SSD au moment où j'avais déplacé la tour. Branchement refait, la machine est repartie. Banal mais formateur : sans ouvrir, je l'aurais probablement amenée en SAV.

Plus tard mon ventilateur de processeur a commencé à faire un bruit anormal. J'ai démonté le bloc, retiré la batterie pour travailler hors tension, déconnecté le ventilateur et inspecté ses pales et son roulement. Une couche de poussière compactée était la cause. Nettoyage, remontage, réapplication propre de la pâte thermique, et le bruit a disparu.

J'ai aussi tenté de réparer le PC de ma mère, qui présentait un problème plus sérieux. Mes diagnostics n'ont pas suffi à identifier la panne, qui s'est avérée être une carte mère défaillante. Échec lucide : tout n'est pas réparable à mon niveau, et j'ai préféré arrêter avant d'aggraver le problème plutôt que de m'acharner.

Ce que je retire de ces interventions c'est qu'un PC n'est pas une boîte noire. Comprendre ce qui se passe à l'intérieur change le rapport qu'on a à la machine : on cesse d'avoir peur de l'ouvrir, on diagnostique au lieu de paniquer, on remplace au lieu de jeter. C'est aussi un bon rappel que tout objet technique a une logique qu'on peut décortiquer si on prend le temps.

Pour mon projet professionnel, cette compétence est secondaire mais utile. Comme indépendant je serai mon propre support technique, je dois pouvoir entretenir mon matériel et identifier rapidement quand un problème vient du logiciel ou du hardware. J'ai aussi compris l'importance de savoir quand passer la main : essayer de réparer au-delà de ses compétences peut coûter plus cher que d'appeler un pro.

Je valorise ce thème à 5 heures, ce qui correspond grosso modo au temps réel des interventions sans compter les commandes de pièces ou la recherche de tutoriels.`
      }
    ]
  },

  /* ============== 6. IA (DÉSERT) ============== */
  ia: {
    id: "ia",
    titre: "Intelligence Artificielle",
    sousTitre: "Tester les limites de l'IA dans la création",
    environnement: "desert",
    heuresValorisees: 10,
    heuresReelles: 250,
    couleurAccent: "#d2a854",
    panneaux: [
      {
        type: "projet",
        titre: "Mes projets autour de l'IA générative et des agents",
        heures: 250,
        valorisation: 10,
        description: "Six prototypes de jeux web créés avec l'aide d'IA (Claude Code) pour tester ses limites créatives, et deux projets sérieux : Beavercode (SaaS d'agents IA pour la création de sites, fait en stage) et Clu (jeu Cluedo Among Us 3D Unity assisté par IA).",
        screenshots: [
          "assets/proofs/ia/Beaver1.png",
          "assets/proofs/ia/Beaver2.png",
          "assets/proofs/ia/Lumina1.webp",
          "assets/proofs/ia/Lumina2.webp",
          "assets/proofs/ia/Mixmoji.webp",
          "assets/proofs/ia/Cellulia1.webp",
          "assets/proofs/ia/Haven1.webp",
          "assets/proofs/ia/Immunis1.webp",
          "assets/proofs/ia/Clu1.webp",
          "assets/proofs/ia/Clu2.webp"
        ],
        liens: [
          { label: "Lumina (jeu de miroirs)", url: "https://crrryyy.itch.io/lumina" },
          { label: "Mixmoji (associations d'emojis)", url: "https://crrryyy.itch.io/mixmoji" },
          { label: "Cellulia (jeu de la vie)", url: "https://crrryyy.itch.io/cellulia" },
          { label: "Beavercode (SaaS pro)", url: "https://beavercode.be/" }
        ],
        analyseReflexive: `L'IA est l'outil qui change le plus vite mon métier en ce moment, et j'ai voulu en tester les forces et les limites par la pratique. J'ai construit plusieurs prototypes en faisant volontairement varier mon niveau de supervision, pour voir où ça casse.

Le premier, Lumina, est un puzzle où il faut illuminer des cristaux avec des miroirs. Je l'ai construit avec Claude Code en supervisant beaucoup, en validant chaque étape. Le résultat tient la route. Mixmoji propose d'associer des emojis pour en révéler de nouveaux : ici l'IA a montré ses limites créatives, certaines associations n'avaient aucune logique et il a fallu que je reprenne la main pour le côté narratif. Cellulia est un jeu de la vie que j'ai laissé l'IA construire en quasi autonomie : le résultat est techniquement fonctionnel mais vide d'intérêt, ce qui m'a confirmé que la pleine autonomie actuelle de l'IA produit des coquilles sans âme. Haven est une expérience plus radicale : zéro supervision, juste des prompts. Le jeu est totalement bordélique, à la limite injouable, et c'est exactement ce que je voulais montrer. Immunis est un tower defense plus contrôlé, où j'ai testé puis débuggé moi-même : le résultat est jouable mais graphiquement faible.

J'ai aussi un projet sérieux dans cette catégorie : Clu, un jeu Cluedo croisé Among Us en 3D Unity avec système host/client, sur lequel je travaille en parallèle. Là je suis aux commandes, l'IA est juste un assistant.

Et surtout il y a Beavercode, le SaaS sur lequel je travaille en stage. Il y avait quasiment rien quand je suis arrivé, j'ai dû créer ou améliorer la majeure partie, en particulier des agents IA conversationnels qui interrogent l'utilisateur pour comprendre son besoin de site internet ou les modifications qu'il souhaite. C'est un travail de fond très différent de mes prototypes : on parle de production, de gestion d'utilisateurs réels, de coût d'API à maîtriser. J'y ai déjà passé environ 200 heures.

Ce que je retiens c'est que l'IA est un accélérateur, pas un substitut. Elle excelle quand on lui donne un cadre précis, elle se perd quand on lui demande de l'invention pure. Le rôle du dev devient celui d'un chef d'orchestre : tu sais où tu vas, l'IA t'aide à y aller plus vite, mais c'est toi qui définis ce qui est bon. Pour mon projet pro d'indé, c'est une révolution : je peux produire à la vitesse d'une équipe, à condition de garder le pilotage. Je valorise ce thème au plafond de 10 heures, sur 250 heures réellement investies (dont 200 sur Beavercode en stage).`
      }
    ]
  },

  /* ============== 7. SÉCURITÉ (PLAGE) ============== */
  securite: {
    id: "securite",
    titre: "Cybersécurité",
    sousTitre: "Challenge cybersécurité EPHEC",
    environnement: "plage",
    heuresValorisees: 10,
    heuresReelles: 15,
    couleurAccent: "#e0c060",
    panneaux: [
      {
        type: "challenge",
        titre: "Création du site Easter Egg pour le challenge cybersécurité EPHEC",
        heures: 15,
        valorisation: 10,
        description: "Avec Fabian, nous avons créé un site frontend et backend pour l'EPHEC, dans le cadre de l'activité cybersécurité. Le site permet aux étudiants de soumettre des codes correspondant à des easter eggs cachés par les profs. Mise en place de la base de données, gestion des soumissions et du scoring.",
        screenshots: [
          "assets/proofs/securite/PeuveCuberSécurité10hSécurité.png",
          "assets/proofs/site/SécuritéChallenge.png",
          "assets/proofs/site/SécuritéChallenge2.png"
        ],
        liens: [
          { label: "Site déployé sur Vercel", url: "https://easter-egg-2025-git-main-lannoyes-projects.vercel.app/" }
        ],
        analyseReflexive: `Le challenge cybersécurité de l'EPHEC est un événement où les profs cachent des easter eggs un peu partout (dans les cours, sur les sites, dans les supports) et où les étudiants doivent les trouver et soumettre les codes pour gagner des points. Avec Fabian, nous avons proposé de prendre en charge la plateforme de soumission elle-même, ce qui a été accepté. Quinze heures de travail à deux, au total.

Côté technique nous avons construit un site complet, frontend et backend. Le frontend est en React déployé sur Vercel, avec une interface simple où l'étudiant entre son nom et un code. Le backend gère la validation des codes (tous ne sont pas valides), le scoring (chaque easter egg vaut un nombre de points différent), et l'historique des soumissions par étudiant. La base de données contient la liste des easter eggs valides, chaque code et son score, et la table des soumissions horodatées.

Le défi côté sécurité c'est précisément que l'on construit un site dont l'objet est lié à la sécurité. On ne pouvait pas se permettre des injections SQL, des codes en clair dans le source, ou des soumissions truquables. J'ai appris à penser un site avec l'œil d'un attaquant potentiel, à ne jamais faire confiance aux entrées utilisateur, à sécuriser les routes côté backend même si on les a cachées côté frontend. Toutes les vérifications de validité de code se font côté serveur.

J'ai aussi appris à structurer un projet web qui doit durer plus que quelques jours. Code organisé en modules, gestion des variables d'environnement, déploiement automatisé via Vercel. Fabian et moi avons travaillé en pair programming sur une bonne partie, ce qui a été riche : on se challengeait mutuellement sur les choix techniques.

Pour mon projet professionnel, comprendre les bases de la sécurité web est non négociable. En tant qu'indé, je serai responsable de mes propres déploiements (Beavercode, GamAI déjà en ligne, mes sites de jeux). Une faille c'est une réputation ruinée et potentiellement des données utilisateurs compromises. Je ne deviendrai pas pentester, mais je veux maintenir une hygiène sécurité minimale dans tout ce que je publie.

Je valorise ce thème à 10 heures (plafond) sur les 15 heures réelles, car une partie du temps est partagée avec le thème Site (création du frontend).`
      }
    ]
  },

  /* ============== 8. SITE WEB (NEIGE) ============== */
  site: {
    id: "site",
    titre: "Sites Web",
    sousTitre: "GamAI (TFE) et formations web",
    environnement: "neige",
    heuresValorisees: 10,
    heuresReelles: 512,
    couleurAccent: "#cfe6f5",
    panneaux: [
      {
        type: "projet",
        titre: "GamAI, mon TFE",
        heures: 500,
        valorisation: 10,
        description: "SaaS qui permet aux utilisateurs de créer leur jeu web en discutant avec une IA, de personnaliser leur jeu et de gérer leurs projets. Tout l'écosystème : Supabase, DNS, sécurité, gestion de mail, upload, déploiement. Le projet a été repris à zéro trois fois pour atteindre la qualité voulue.",
        screenshots: [
          "assets/proofs/site/GamAI.png",
          "assets/proofs/site/GamAI2.png"
        ],
        liens: [
          { label: "GamAI en ligne", url: "https://gamai.app/dashboard" }
        ],
        analyseReflexive: `GamAI est mon Travail de Fin d'Études et le projet sur lequel j'ai le plus appris à ce jour. C'est un SaaS qui permet à un utilisateur de créer son propre jeu web en parlant à une IA, de personnaliser le jeu généré, et de gérer plusieurs projets dans un dashboard. Techniquement c'est un agent IA spécialisé dans la génération de jeux Phaser à partir d'une description en langage naturel, plus toute une infrastructure autour pour héberger les comptes, les jeux, les builds.

Le projet a été repris trois fois depuis zéro. La première version ne tenait pas la route niveau architecture, la deuxième s'est cassée sur des choix de stack qui ne passaient pas à l'échelle, et la troisième est celle qui est en ligne. Cinq cents heures cumulées sur l'ensemble. C'est par ce projet que j'ai vraiment appris ce qu'est faire un produit en ligne complet : Supabase pour la base et l'auth, configuration DNS pour pointer un nom de domaine sur l'app, certificats HTTPS, gestion des envois de mail (mot de passe oublié, vérification d'email), upload de fichiers dans le bucket, sécurité des routes API, Row Level Security côté base, build et déploiement.

Chaque galère m'a appris quelque chose. La fois où j'ai cassé l'authentification en production parce que j'avais oublié de migrer une variable d'environnement m'a appris à séparer rigoureusement environnements de dev et de prod. La fois où j'ai exposé une clé d'API par mégarde dans un commit m'a appris à utiliser systématiquement un .gitignore propre et à scanner mes commits. La fois où le coût d'API IA a explosé m'a appris à mettre des quotas dès la première version.

Le projet est encore vivant et je continue à l'améliorer. C'est mon premier vrai produit en ligne accessible à n'importe qui depuis n'importe où dans le monde, et c'est une fierté.

Pour mon projet pro d'indé, GamAI est l'archétype de ce que je veux faire : concevoir, builder, déployer, maintenir, vendre. Un produit complet géré par une seule personne. Tout ce que j'ai appris dessus est directement transposable à mes futurs jeux et SaaS. C'est aussi ce projet qui a confirmé que je peux tenir la durée sur quelque chose de complexe sans le laisser tomber, ce qui était un de mes doutes personnels.

Je valorise ce thème à 10 heures (plafond imposé) pour 500 heures réellement investies au total.`
      },
      {
        type: "formation",
        titre: "Formations web (HTML, CSS, JS, PromoSciences)",
        heures: 30,
        valorisation: 10,
        description: "Plusieurs formations distancielles suivies dans le cadre des études : HTML5, CSS, JS, programmation, PromoSciences. Les attestations sont fournies en preuve.",
        screenshots: [
          "assets/proofs/site/PreuveSécurité10hSite.png"
        ],
        liens: [
          { label: "Attestation HTML5", url: "assets/proofs/formations/HTML5317_Attestation de suivi.pdf" },
          { label: "Attestation CSS", url: "assets/proofs/formations/CSS241_Attestation de suivi.pdf" },
          { label: "Attestation HTML", url: "assets/proofs/formations/HTML303_Attestation de suivi.pdf" },
          { label: "Attestation Programmation", url: "assets/proofs/formations/PROGRAM250_Attestation de suivi.pdf" },
          { label: "Attestation Site (coaching)", url: "assets/proofs/formations/SITE021_Attestation de suivi (coaching allégé).pdf" },
          { label: "Attestation PromoSciences", url: "assets/proofs/formations/PROMOSC021 _Attestation de suivi.pdf" }
        ],
        analyseReflexive: `J'ai suivi plusieurs formations à distance dans le cadre de mes études à l'EPHEC pour solidifier mes bases en développement web. Ces formations couvrent HTML5, CSS, JS, programmation générale, et un module PromoSciences plus large. Toutes ont donné lieu à une attestation de suivi que je joins en preuve.

Le format distanciel a ses avantages et ses limites. L'avantage c'est que je peux y aller à mon rythme, revenir sur un point qui ne passe pas, m'arrêter pour coder un exemple en parallèle. La limite c'est qu'il faut s'auto-discipliner : sans deadline forte ni présence d'un prof, on peut vite repousser. J'ai appris à me fixer un créneau fixe par semaine pour ces modules, sinon ils traînent.

Sur le contenu, ces formations m'ont d'abord donné les fondations propres. Avant elles je codais en HTML/CSS un peu au feeling, en bricolant. Après je connais la sémantique HTML5, je comprends pourquoi un h1 a un sens et pourquoi il faut l'utiliser correctement, je connais les unités CSS et leurs cas d'usage (rem, em, vh, ch), je comprends le modèle de boîte, le flexbox, le grid. Sur JS j'ai consolidé les structures de données, les fonctions, la gestion d'événements DOM, l'asynchrone basique avec promesses.

C'est sur ces bases que repose tout le travail web que j'ai fait par la suite : le site Easter Egg en sécurité, le SaaS GamAI, mes jeux web sur itch.io, et même ce portfolio que tu lis en ce moment. Sans ces formations je serais toujours à bricoler et à recopier sans comprendre.

Pour mon projet professionnel d'indé, le web n'est pas mon métier principal mais c'est l'enrobage indispensable. Tout ce que je publie aura une page, un site, une landing. Tout ce que je vendrai aura un compte, un dashboard, un paiement. Maîtriser le web me donne l'autonomie nécessaire pour construire ces couches sans dépendre de personne.

Je valorise ce thème à 10 heures (plafond), pour environ 30 heures cumulées sur l'ensemble des formations distancielles. Le format distanciel est limité à 5 formations selon les consignes, je suis dans les clous.`
      }
    ]
  }

};

/* Liste ordonnée des thèmes pour le parcours top-down (de haut en bas) */
window.PORTFOLIO.parcours = [
  "design3d",
  "app",
  "gamedev",
  "electronique",
  "hardware",
  "ia",
  "securite",
  "site"
];
