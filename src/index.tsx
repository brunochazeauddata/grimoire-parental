import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useMutation } from "convex/react";
import { ConvexProvider, ConvexReactClient, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";


// --- DATA STRUCTURES ---

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Level {
  id: number;
  phase: string;
  title: string;
  pnl_concept: string;
  book_reference: string;
  theory: string;
  quiz: QuizQuestion[];
  real_mission: string;
  validation_message: string;
  visual_asset: string;
  fairy_speech: string;
  isUnlocked?: boolean;
}

// --- DATA REPOSITORY ---
const LEVELS: Level[] = [
  {
    id: 1,
    phase: "Les Racines",
    title: "Le Regard de l'Âme",
    pnl_concept: "Calibrage (Calibration)",
    book_reference: "La PNL avec les enfants",
    fairy_speech: "Bienvenue. Pour guider, il faut d'abord apprendre à voir. Pas seulement regarder, mais capter l'invisible.",
    theory: "En PNL, le 'Calibrage' est la capacité à remarquer les changements physiologiques subtils chez une autre personne. Souvent, en tant que parents, nous sommes des 'lecteurs de pensée' : nous projetons nos interprétations ('Il boude', 'Il est fatigué') au lieu d'observer les faits bruts. \n\nLe vrai calibrage consiste à observer sans juger : la couleur de la peau qui change, la lèvre inférieure qui tremble légèrement, le rythme de la respiration qui s'accélère, la dilatation des pupilles. C'est l'acuité sensorielle. \n\nAvant qu'un enfant ne crie, son corps a déjà envoyé dix signaux d'alerte. Si vous apprenez à calibrer ces micro-signaux, vous pourrez intervenir au moment magique : avant la crise. C'est la différence entre réagir et accompagner.",
    quiz: [
      {
        question: "Qu'est-ce que le calibrage ?",
        options: ["Deviner ce que l'enfant pense", "Observer les changements physiologiques", "Lui demander pourquoi il pleure"],
        correctAnswer: 1
      },
      {
        question: "Que doit-on observer en priorité ?",
        options: ["Les vêtements", "Le contenu des mots", "La respiration et le tonus musculaire"],
        correctAnswer: 2
      },
      {
        question: "Quand le calibrage est-il le plus utile ?",
        options: ["Pendant la crise", "Avant la crise (prévention)", "Après la punition"],
        correctAnswer: 1
      }
    ],
    real_mission: "MISSION D'OBSERVATEUR SILENCIEUX :\nPendant le prochain repas, ne participez pas activement aux conversations pendant 5 minutes. Contentez-vous d'observer la respiration de votre enfant. Est-elle haute (poitrine) ou basse (ventre) ? Rapide ou lente ? Change-t-elle quand il parle de quelque chose qu'il aime ? Notez mentalement 3 micro-changements.",
    validation_message: "Tu as ouvert tes véritables yeux. Cette attention silencieuse est une forme d'amour pur. Tu commences à lire le langage secret de son corps.",
    visual_asset: "Une graine dorée qui pulse doucement dans la terre sombre."
  },
  {
    id: 2,
    phase: "Les Racines",
    title: "Le Miroir des Images (V)",
    pnl_concept: "VAK (Visuel)",
    book_reference: "La PNL avec les enfants",
    fairy_speech: "Chaque enfant habite un monde différent. Certains vivent dans une galerie de tableaux. ✨ PETIT SECRET : Si tu persévères jusqu'au niveau 10, une merveilleuse surprise t'attend ! ✨",
    theory: "Nous filtrons la réalité à travers nos sens (VAKOG). L'enfant 'Visuel' pense en images. Pour lui, comprendre, c'est 'voir'. Il parle souvent vite (pour suivre le défilement des images dans sa tête), respire haut dans la poitrine, et utilise des prédicats comme : 'C'est clair', 'Je vois', 'C'est brillant', 'Regarde'. \n\nSi vous lui donnez des explications longues et sans images, il décroche. Pour connecter avec lui, vous devez peindre avec vos mots. Soyez ordonné visuellement, regardez-le dans les yeux, et utilisez des métaphores colorées.",
    quiz: [
      {
        question: "Un enfant visuel a tendance à :",
        options: ["Parler lentement", "Parler vite et respirer haut", "Toucher tout le monde"],
        correctAnswer: 1
      },
      {
        question: "Quelle expression appartient au registre visuel ?",
        options: ["J'entends bien", "C'est flou", "Ça me touche"],
        correctAnswer: 1
      },
      {
        question: "Comment aider un enfant visuel à apprendre ?",
        options: ["Lui faire un dessin ou un schéma", "Lui expliquer oralement", "Le faire bouger"],
        correctAnswer: 0
      }
    ],
    real_mission: "MISSION DE DÉTECTION V :\nAujourd'hui, repérez si votre enfant utilise des mots visuels. Essayez de lui donner une consigne en utilisant une image : 'Imagine que ta chambre est un château qui doit être prêt pour le roi' au lieu de 'Range ta chambre'.",
    validation_message: "Tu commences à parler sa langue. En colorant tes mots, tu as capté son attention. Le monde est une toile, et tu en es le peintre.",
    visual_asset: "Une racine de cristal transparent."
  },
  {
    id: 3,
    phase: "Les Racines",
    title: "L'Écho de la Mélodie (A)",
    pnl_concept: "VAK (Auditif)",
    book_reference: "La PNL avec les enfants",
    fairy_speech: "D'autres enfants habitent un monde de symphonies et de bruits. Écoute-les.",
    theory: "L'enfant 'Auditif' vit dans le son. Il est sensible au ton de votre voix, plus qu'aux mots eux-mêmes. Une voix stridente l'agresse physiquement. Il apprend en écoutant, se parle souvent à lui-même en jouant, et peut être distrait par le moindre bruit ambiant. \n\nSes expressions favorites : 'Ça me parle', 'J'entends', 'C'est inouï', 'Ça sonne faux'. Pour l'apaiser, rien ne vaut une voix mélodieuse, calme et rythmée. La musique est son refuge.",
    quiz: [
      {
        question: "L'enfant auditif est très sensible à :",
        options: ["La décoration de sa chambre", "L'intonation de votre voix", "L'étiquette qui gratte son cou"],
        correctAnswer: 1
      },
      {
        question: "Comment apprend-il le mieux ?",
        options: ["En récitant à haute voix", "En regardant des schémas", "En marchant"],
        correctAnswer: 0
      },
      {
        question: "Quel mot est auditif ?",
        options: ["Brillant", "Harmonie", "Solide"],
        correctAnswer: 1
      }
    ],
    real_mission: "MISSION DU CHEF D'ORCHESTRE :\nLisez-lui une histoire ce soir en mettant une emphase exagérée sur les intonations. Chuchotez, puis tonnez, faites des pauses. Observez comme son attention se fixe sur la mélodie de votre voix.",
    validation_message: "Tu as trouvé la fréquence de son cœur. Ta voix peut être une caresse ou un orage. Choisis la mélodie qui apaise.",
    visual_asset: "Une racine entourée d'ondes dorées."
  },
  {
    id: 4,
    phase: "Les Racines",
    title: "La Danse du Ressenti (K)",
    pnl_concept: "VAK (Kinesthésique)",
    book_reference: "La PNL avec les enfants",
    fairy_speech: "Enfin, il y a ceux qui comprennent le monde en le touchant. Le mouvement est leur intelligence.",
    theory: "L'enfant 'Kinesthésique' filtre par le ressenti et le mouvement. Il a besoin de toucher pour comprendre. On le dit souvent 'bougeotte', mais c'est ainsi que son cerveau s'active. Il parle plus lentement (le temps d'accéder à ses sensations), respire par le ventre. \n\nSes mots : 'Je sens', 'C'est lourd', 'Choquant', 'Prendre contact'. Ne le forcez pas à rester statique pour apprendre. Utilisez le contact physique (main sur l'épaule) pour l'ancrer et le rassurer.",
    quiz: [
      {
        question: "L'enfant kinesthésique a besoin de :",
        options: ["Voir des graphiques", "Bouger et toucher", "Écouter des conférences"],
        correctAnswer: 1
      },
      {
        question: "Sa respiration est généralement :",
        options: ["Haute et rapide", "Basse et abdominale", "Irrégulière"],
        correctAnswer: 1
      },
      {
        question: "Comment le calmer ?",
        options: ["Lui montrer une image calme", "Un câlin ou un contact ferme", "Lui parler doucement"],
        correctAnswer: 1
      }
    ],
    real_mission: "MISSION D'ANCRAGE TACTILE :\nChaque fois que vous dites un mot positif à votre enfant aujourd'hui ('Bravo', 'Je t'aime'), accompagnez-le d'un contact physique spécifique (ex: main sur l'épaule ou caresse cheveux). Créez ce lien neurologique.",
    validation_message: "Tu as touché son âme en touchant son épaule. Le corps n'oublie jamais la bienveillance.",
    visual_asset: "Une racine robuste et texturée."
  },
  {
    id: 5,
    phase: "Les Racines",
    title: "Le Bouton Magique",
    pnl_concept: "Ancrage (Anchoring)",
    book_reference: "Happy Kids Happy You",
    fairy_speech: "Et si tu pouvais capturer un éclat de rire et le garder dans ta poche pour les jours de pluie ?",
    theory: "Un 'Ancrage' est une association neurologique puissante entre un stimulus (un geste, un son, une odeur) et un état émotionnel intense. C'est le principe de la Madeleine de Proust. En PNL, nous pouvons créer ces liens délibérément. \n\nL'objectif est de créer un 'Bouton Magique' sur votre enfant. Quand il est dans un état de ressource intense (fou rire, grande fierté, calme absolu), vous appliquez un stimulus unique (ex: une pression douce sur le poignet). En répétant cela, le simple fait de presser son poignet réactivera neurologiquement cet état de bien-être.",
    quiz: [
      {
        question: "Un ancrage relie :",
        options: ["Un stimulus et une réponse émotionnelle", "Une cause et une conséquence", "Un parent et un enfant"],
        correctAnswer: 0
      },
      {
        question: "Quand doit-on poser l'ancre ?",
        options: ["Quand l'enfant va mal pour le calmer", "Au pic de l'intensité d'une émotion positive", "N'importe quand"],
        correctAnswer: 1
      },
      {
        question: "À quoi sert l'ancre ensuite ?",
        options: ["À manipuler l'enfant", "À réactiver une ressource (calme/confiance) au besoin", "À rien"],
        correctAnswer: 1
      }
    ],
    real_mission: "MISSION DU BOUTON MAGIQUE :\nGuettez un moment de joie pure aujourd'hui. Au sommet de son rire, pressez doucement son avant-bras en souriant. Relâchez quand l'émotion redescend. Répétez 3 fois si possible. Testez le 'bouton' demain.",
    validation_message: "Tu es un architecte émotionnel. Tu as posé une fondation de joie accessible à tout moment. C'est de la magie pure.",
    visual_asset: "Le tronc commence à se former, solide et doré."
  },
  {
    id: 6,
    phase: "Le Tronc",
    title: "L'Alchimie des Mots",
    pnl_concept: "Langage Positif",
    book_reference: "Happy Kids Happy You",
    fairy_speech: "Les mots sont des sorts. Ne lance pas de malédictions involontaires.",
    theory: "Le cerveau ne traite pas la négation directement. Si je vous dis 'Ne pensez pas à un éléphant rose', vous y pensez. Dire à un enfant 'Ne cours pas' ou 'Ne renverse pas', c'est installer l'image de la chute. \n\nTransformez chaque négation en instruction positive directe. C'est la règle du 'Turn Don'ts into Do's'. Au lieu de dire ce qu'il ne faut pas faire, dites ce qu'il FAUT faire. Cela donne une direction claire au cerveau de l'enfant et réduit l'anxiété.",
    quiz: [
      {
        question: "Le cerveau comprend-il la négation (ex: 'Ne cours pas') ?",
        options: ["Oui, parfaitement", "Non, il visualise d'abord l'action interdite", "Seulement chez les adultes"],
        correctAnswer: 1
      },
      {
        question: "Quelle phrase est la mieux formulée ?",
        options: ["Ne renverse pas ton verre", "Tiens ton verre bien droit", "Arrête de bouger"],
        correctAnswer: 1
      }
    ],
    real_mission: "JEU DU TRADUCTEUR :\nPendant 24h, bannissez le 'NE... PAS'. Remplacez 'Ne crie pas' par 'Parle doucement'. Remplacez 'Ne tape pas' par 'Caresse' ou 'Utilise tes mots'.",
    validation_message: "Tes mots sont devenus des guides, plus des barrières. L'énergie circule mieux quand la porte est ouverte.",
    visual_asset: "Le tronc s'élève en or pur."
  },
  {
    id: 7,
    phase: "Le Tronc",
    title: "La Spirale du OUI",
    pnl_concept: "Yes Set",
    book_reference: "Happy Kids Happy You",
    fairy_speech: "L'eau coule là où c'est ouvert. Ouvre les portes avant de demander d'entrer.",
    theory: "Le 'Yes Set' consiste à créer une dynamique d'accord. Si vous obtenez 3 'Oui' sur des choses simples et factuelles, vous créez une inertie positive. Le cerveau de l'enfant se met en mode 'Coopération'. \n\nC'est l'anti-bras de fer. Avant une demande difficile (ex: aller au lit), posez des questions évidents : 'Tu as bien joué ?' (Oui), 'Tu as ton doudou ?' (Oui), 'Il fait nuit dehors ?' (Oui). 'On va au lit ?' (Probabilité de Oui augmentée).",
    quiz: [
      {
        question: "Le 'Yes Set' sert à :",
        options: ["Manipuler l'enfant contre son gré", "Créer une inertie de coopération", "Faire dire oui à tout"],
        correctAnswer: 1
      },
      {
        question: "Combien de 'Oui' factuels cherche-t-on avant la demande ?",
        options: ["Un seul suffit", "Au moins trois", "Une dizaine"],
        correctAnswer: 1
      }
    ],
    real_mission: "MISSION 'TROIS OUI' :\nAvant le rituel du soir, posez 3 questions factuelles dont la réponse est obligatoirement OUI. Enchaînez ensuite avec votre demande. Observez la fluidité.",
    validation_message: "Tu as appris à surfer sur la vague de l'accord. La résistance a fondu comme neige au soleil.",
    visual_asset: "Des anneaux de croissance lumineux."
  },
  {
    id: 8,
    phase: "Le Tronc",
    title: "Le Sentier des Choix",
    pnl_concept: "Double Contrainte Illusoire",
    book_reference: "Happy Kids Happy You",
    fairy_speech: "La liberté est un besoin, la sécurité aussi. Offre les deux.",
    theory: "L'autorité frontale crée la rébellion. Le choix crée l'engagement. Mais le choix doit être cadré. C'est la 'Double Contrainte Illusoire'. Vous ne demandez pas 'Veux-tu te laver ?' (Choix ouvert = risque de Non), mais 'Veux-tu te laver maintenant ou après le dessin ?'. \n\nL'enfant sent qu'il a le pouvoir (il choisit le moment), mais le cadre est posé (il va se laver). C'est gagnant-gagnant.",
    quiz: [
      {
        question: "La 'Double Contrainte Illusoire' offre :",
        options: ["Une liberté totale", "Un choix entre deux options qui valident le même objectif", "Une punition déguisée"],
        correctAnswer: 1
      },
      {
        question: "Quelle est la meilleure formulation ?",
        options: ["Mange tes légumes !", "Veux-tu des petits pois ou des carottes ?", "Si tu ne manges pas, tu seras privé de dessert"],
        correctAnswer: 1
      }
    ],
    real_mission: "MISSION DU CHOIX GUIDÉ :\nNe donnez aucun ordre direct aujourd'hui. Transformez tout en choix binaire : 'Tu mets les chaussures rouges ou les bleues ?', 'On range les voitures ou les legos en premier ?'.",
    validation_message: "Tu as donné le pouvoir sans perdre le cap. C'est ça, être un Roi/Reine bienveillant(e).",
    visual_asset: "Le tronc se divise en deux branches."
  },
  {
    id: 9,
    phase: "Le Tronc",
    title: "Le Cœur de l'Action",
    pnl_concept: "Intention Positive",
    book_reference: "La PNL avec les enfants",
    fairy_speech: "Il n'y a pas de monstres, juste des créatures blessées ou maladroites.",
    theory: "Axiome PNL : 'Tout comportement a une intention positive'. Même le comportement le plus gênant (crise, coup, bouderie) cherche à satisfaire un besoin important pour l'enfant (être vu, se sentir en sécurité, exprimer une frustration). \n\nNe condamnez pas l'enfant, ni même l'intention. Condamnez le MOYEN. Dites : 'Je sais que tu veux décider tout seul (Intention validée), mais on ne tape pas (Comportement refusé). Tu peux le dire avec des mots (Nouveau moyen)'.",
    quiz: [
      {
        question: "Selon la PNL, derrière chaque comportement, il y a :",
        options: ["De la méchanceté", "Une intention positive", "Du hasard"],
        correctAnswer: 1
      },
      {
        question: "Que faut-il corriger ?",
        options: ["L'enfant lui-même", "L'intention", "Le moyen utilisé pour satisfaire l'intention"],
        correctAnswer: 2
      }
    ],
    real_mission: "MISSION D'ENQUÊTEUR :\nFace à une bêtise aujourd'hui, demandez-vous : 'Que cherche-t-il d'utile pour lui en faisant ça ?'. Validez ce besoin à voix haute auprès de lui.",
    validation_message: "Tu as vu la lumière derrière l'ombre. En validant son besoin, tu as apaisé son cœur.",
    visual_asset: "Un cœur pulsant au centre de l'arbre."
  },
  {
    id: 10,
    phase: "Le Tronc",
    title: "Le Cadre Magique",
    pnl_concept: "Recadrage (Reframing)",
    book_reference: "La PNL de A à Z",
    fairy_speech: "Rien n'est triste ou joyeux. C'est la façon dont tu regardes qui peint le monde.",
    theory: "Le 'Recadrage' est l'art de changer le sens d'une expérience en changeant son contexte ou sa perspective. \n\nRecadrage de Sens : Votre enfant est 'têtu' ? Non, il est 'déterminé' et 'sait ce qu'il veut' (Qualité future de leader). Il est 'colérique' ? Non, il est 'passionné' et 'intense'. \n\nEn changeant l'étiquette que vous mettez sur lui, vous changez la façon dont vous le traitez, et finalement, vous changez son destin. Ne l'enfermez pas dans une boîte négative.",
    quiz: [
      {
        question: "Recadrer c'est :",
        options: ["Mentir sur la réalité", "Changer de perspective pour trouver une ressource", "Ignorer le problème"],
        correctAnswer: 1
      },
      {
        question: "Un enfant 'bavard' peut être recadré en :",
        options: ["Sociable et bon communicant", "Bruyant", "Fatigant"],
        correctAnswer: 0
      },
      {
        question: "L'effet Pygmalion signifie :",
        options: ["L'enfant devient ce qu'on projette sur lui", "L'enfant ne change jamais", "Les étiquettes n'ont pas d'importance"],
        correctAnswer: 0
      }
    ],
    real_mission: "MISSION DE L'ALCHIMISTE :\nPrenez le défaut qui vous agace le plus chez votre enfant. Écrivez-le. Trouvez 3 contextes (métier, situation d'urgence) où ce trait serait une qualité inestimable. Dites-lui ce soir : 'J'aime ta détermination' (au lieu de ta tête de mule).",
    validation_message: "Tu as transformé le plomb en or. Tu as libéré ton enfant d'une prison de mots.",
    visual_asset: "Des gravures magiques sur le tronc."
  },
  {
    id: 11,
    phase: "Le Tronc",
    title: "Le Conte Guérisseur",
    pnl_concept: "Métaphore Isomorphique",
    book_reference: "La PNL avec les enfants",
    fairy_speech: "Raconte une histoire d'un petit animal qui avait le même problème.",
    theory: "Parfois, le message direct bloque car l'enfant se sent visé. L'histoire (ou métaphore) contourne les défenses conscientes. En racontant l'histoire d'un 'Petit Ours qui avait peur du noir mais trouva une étoile', l'inconscient de l'enfant fait le lien avec sa propre situation. C'est un apprentissage indirect, doux et puissant.",
    quiz: [
      {
        question: "Pourquoi utiliser une métaphore ?",
        options: ["Pour endormir l'enfant", "Pour contourner les résistances conscientes", "Parce que c'est plus court"],
        correctAnswer: 1
      },
      {
        question: "L'histoire doit :",
        options: ["Ne rien avoir à voir avec le problème", "Avoir une structure similaire au problème de l'enfant (isomorphisme)", "Toujours finir mal"],
        correctAnswer: 1
      }
    ],
    real_mission: "Inventez une histoire ce soir pour résoudre un problème actuel (ex: peur, colère). Utilisez des animaux.",
    validation_message: "L'histoire a semé une graine de solution dans son inconscient.",
    visual_asset: "Sève lumineuse."
  },
  {
    id: 12,
    phase: "Les Branches",
    title: "Le Maître des Orages",
    pnl_concept: "Gestion d'État",
    book_reference: "NLP for Parents",
    fairy_speech: "Apaise ta propre tempête avant de vouloir calmer la sienne.",
    theory: "Les enfants sont connectés à nous par les neurones miroirs. Si vous êtes stressé, ils le deviennent. Si vous criez 'CALME-TOI !', vous êtes incongruent. Pour calmer une crise, vous devez d'abord modifier VOTRE état interne (physiologie, respiration). Devenez le calme que vous voulez voir. Vous êtes le thermostat, l'enfant est le thermomètre.",
    quiz: [
      {
        question: "Qui doit se calmer en premier lors d'une crise ?",
        options: ["L'enfant", "Le parent", "Le voisin"],
        correctAnswer: 1
      },
      {
        question: "Les neurones miroirs font que :",
        options: ["L'enfant imite notre état émotionnel", "L'enfant nous ignore", "L'enfant dort"],
        correctAnswer: 0
      }
    ],
    real_mission: "Respiration Carrée (4s inspire, 4s bloque, 4s expire, 4s bloque) dès que la tension monte aujourd'hui.",
    validation_message: "Ton calme est devenu son refuge.",
    visual_asset: "Branches d'argent."
  },
  {
    id: 13,
    phase: "Les Branches",
    title: "L'Ancre de Ressource",
    pnl_concept: "Auto-Ancrage",
    book_reference: "NLP for Parents",
    fairy_speech: "Crée ton propre bouton de patience.",
    theory: "Tout comme vous avez créé une ancre pour l'enfant, créez-en une pour vous. Choisissez un moment où vous vous êtes senti incroyablement patient et aimant. Amplifiez ce souvenir. Au pic de l'émotion, faites un geste discret (ex: joindre pouce et index). Répétez. En situation de crise, faites ce geste pour retrouver instantanément vos ressources.",
    quiz: [
      {
        question: "L'auto-ancrage sert à :",
        options: ["Se souvenir de sa liste de courses", "Accéder à une ressource interne (patience/calme) sur demande", "Faire de la magie noire"],
        correctAnswer: 1
      },
      {
        question: "Le stimulus doit être :",
        options: ["Toujours le même et unique", "Aléatoire", "Douloureux"],
        correctAnswer: 0
      }
    ],
    real_mission: "Créez une ancre 'Patience Infinie' sur votre propre corps et testez-la lors du prochain caprice.",
    validation_message: "Tu as repris les commandes de ton navire.",
    visual_asset: "Joyau sur une branche."
  },
  {
    id: 14,
    phase: "Les Branches",
    title: "Le Balai de l'Esprit",
    pnl_concept: "Swish Pattern",
    book_reference: "La PNL de A à Z",
    fairy_speech: "Remplace l'image de l'échec par celle du succès. SWISH !",
    theory: "Le Swish est une technique pour changer une habitude ou une peur. Si l'enfant a peur du chien, il a une image effrayante en tête. Créez une image de lui confiant et heureux avec le chien. Faites-lui imaginer l'image effrayante, puis, très vite (SWISH!), remplacez-la par l'image positive. La vitesse est la clé pour reprogrammer le cerveau.",
    quiz: [
      {
        question: "Le Swish joue sur :",
        options: ["La lenteur et l'analyse", "La vitesse et les sous-modalités visuelles", "L'ouïe"],
        correctAnswer: 1
      },
      {
        question: "On remplace :",
        options: ["Une image ressource par une image problème", "Une image problème (déclencheur) par une image de soi ayant réussi", "Rien du tout"],
        correctAnswer: 1
      }
    ],
    real_mission: "Faites l'exercice du Swish visuel avec votre enfant sur une petite peur ou hésitation.",
    validation_message: "Les vieilles peurs ont laissé place aux nouveaux rêves.",
    visual_asset: "Bourgeons d'or."
  },
  {
    id: 15,
    phase: "Les Branches",
    title: "Le Génie de la Copie",
    pnl_concept: "Modélisation",
    book_reference: "Happy Kids Happy You",
    fairy_speech: "Joue à faire 'comme si' tu étais un super-héros.",
    theory: "La modélisation est le cœur de la PNL. Pour réussir quelque chose, il suffit de copier quelqu'un qui réussit. Si votre enfant manque de courage, demandez-lui : 'Quel est ton héros ?'. 'Batman'. 'Comment ferait Batman ici ?'. En adoptant la posture de Batman, il accède aux ressources de Batman.",
    quiz: [
      {
        question: "La modélisation consiste à :",
        options: ["Copier les stratégies de réussite d'un modèle", "Voler les idées des autres", "Être jaloux"],
        correctAnswer: 0
      },
      {
        question: "Le jeu du 'Comme si' permet de :",
        options: ["Mentir", "Accéder à des ressources inexploitées", "Perdre du temps"],
        correctAnswer: 1
      }
    ],
    real_mission: "Jeu de rôle : 'Comment ferait [Héros Préféré] pour ranger sa chambre ?'. Observez le changement de posture.",
    validation_message: "Il a emprunté la cape du héros pour grandir.",
    visual_asset: "Réseau de branches dense."
  },
  {
    id: 16,
    phase: "Les Branches",
    title: "La Danse des Trois Chaises",
    pnl_concept: "Positions de Perception",
    book_reference: "NLP for Parents",
    fairy_speech: "Visite ses chaussures, puis regardez-vous depuis la lune.",
    theory: "Pour résoudre un conflit, explorez 3 positions. 1ère : Vous-même (vos besoins). 2ème : L'autre (mettez-vous physiquement à sa place, imitez sa posture, ressentez ce qu'il ressent). 3ème : L'observateur neutre (une mouche au plafond). Cela développe l'empathie et la sagesse.",
    quiz: [
      {
        question: "La 2ème position consiste à :",
        options: ["Rester sur ses positions", "Se mettre à la place de l'autre (empathie totale)", "Juger l'autre"],
        correctAnswer: 1
      },
      {
        question: "La 3ème position permet :",
        options: ["Le détachement et l'analyse neutre", "L'émotion intense", "La colère"],
        correctAnswer: 0
      }
    ],
    real_mission: "Lors d'un désaccord, demandez à l'enfant : 'Si tu étais maman/papa, qu'est-ce que tu verrais ?'.",
    validation_message: "La compréhension a remplacé le jugement.",
    visual_asset: "Oiseaux de cristal."
  },
  {
    id: 17,
    phase: "La Canopée",
    title: "L'Échelle des Étoiles",
    pnl_concept: "Niveaux Logiques",
    book_reference: "NLP for Parents",
    fairy_speech: "Ne dis pas 'C'est bien fait', dis 'Tu es persévérant'.",
    theory: "Les Niveaux Logiques (Dilts) hiérarchisent l'expérience : Environnement, Comportement, Capacité, Croyance, Identité. Un compliment au niveau de l'Identité ('Tu es généreux') est 100x plus puissant qu'au niveau Comportement ('Tu as bien prêté'). Nourrissez l'Identité positive.",
    quiz: [
      {
        question: "Quel est le niveau le plus profond ?",
        options: ["Environnement (Où ?)", "Comportement (Quoi ?)", "Identité (Qui ?/Je suis)"],
        correctAnswer: 2
      },
      {
        question: "'Tu as eu une bonne note' est un compliment sur :",
        options: ["L'identité", "Le résultat/Comportement", "La croyance"],
        correctAnswer: 1
      }
    ],
    real_mission: "Faites 3 compliments sur l'IDENTITÉ aujourd'hui ('Tu es curieux', 'Tu es un artiste').",
    validation_message: "Tu as nourri ses racines les plus profondes.",
    visual_asset: "Aura lumineuse."
  },
  {
    id: 18,
    phase: "La Canopée",
    title: "Le Jardin des Croyances",
    pnl_concept: "Croyances Limitantes",
    book_reference: "La PNL de A à Z",
    fairy_speech: "Transforme 'Je suis nul' en 'J'apprends encore'.",
    theory: "Une croyance est une pensée tenue pour vraie. 'Je suis nul en maths' est une croyance limitante. Ajoutez le mot magique 'ENCORE'. 'Je ne suis pas bon en maths... ENCORE'. Cela ouvre le futur. Aidez l'enfant à identifier et déraciner ses mauvaises herbes mentales.",
    quiz: [
      {
        question: "Le mot magique pour casser une croyance d'échec est :",
        options: ["Jamais", "Toujours", "Encore (Not yet)"],
        correctAnswer: 2
      },
      {
        question: "Les croyances :",
        options: ["Sont des vérités absolues", "Sont des prophéties auto-réalisatrices", "N'ont aucun impact"],
        correctAnswer: 1
      }
    ],
    real_mission: "Ajoutez '...pour le moment' ou '...encore' à chaque phrase négative de l'enfant.",
    validation_message: "Tu as ouvert le champ des possibles.",
    visual_asset: "Fleurs magnifiques."
  },
  {
    id: 19,
    phase: "La Canopée",
    title: "La Boussole Intérieure",
    pnl_concept: "Valeurs",
    book_reference: "La PNL avec les enfants",
    fairy_speech: "Qu'est-ce qui compte vraiment pour votre tribu ?",
    theory: "Les valeurs (Liberté, Respect, Amour, Curiosité) sont ce qui nous motive profondément. Les conflits naissent souvent d'un conflit de valeurs. Si l'enfant ne range pas (Valeur: Jeu/Liberté) et que vous criez (Valeur: Ordre/Respect), négociez sur les valeurs. 'Comment peux-tu jouer (ta valeur) tout en gardant la chambre agréable (ma valeur) ?'.",
    quiz: [
      {
        question: "Les valeurs sont :",
        options: ["Des règles rigides", "Les moteurs profonds de nos motivations", "Des prix"],
        correctAnswer: 1
      },
      {
        question: "Négocier sur les valeurs permet :",
        options: ["De trouver un compromis gagnant-gagnant", "De perdre la face", "D'abandonner"],
        correctAnswer: 0
      }
    ],
    real_mission: "Définissez les 3 valeurs phares de la famille lors d'un conseil de famille.",
    validation_message: "Votre famille a maintenant un cap.",
    visual_asset: "Fruits dorés."
  },
  {
    id: 20,
    phase: "La Canopée",
    title: "Le Chemin du Futur",
    pnl_concept: "Ligne du Temps",
    book_reference: "NLP for Parents",
    fairy_speech: "Marche vers ton futur réussi.",
    theory: "La 'Ligne du Temps' permet de visualiser l'avenir. Si l'enfant a peur d'un examen, faites-le visualiser l'après-examen, quand c'est réussi. Faites-lui 'marcher' physiquement sur une ligne imaginaire au sol, du présent vers le futur, en emportant des ressources (courage, calme).",
    quiz: [
      {
        question: "La Ligne du Temps utilise :",
        options: ["La spatialisation du temps", "Une horloge", "Le passé uniquement"],
        correctAnswer: 0
      },
      {
        question: "Visualiser la réussite future aide à :",
        options: ["Être déçu", "Programmer le cerveau pour le succès", "Ignorer le présent"],
        correctAnswer: 1
      }
    ],
    real_mission: "Faites marcher l'enfant sur une ligne au sol vers son succès (rentrée, sport, spectacle).",
    validation_message: "Le futur est devenu une promesse, pas une peur.",
    visual_asset: "Fruits joyaux."
  },
  {
    id: 21,
    phase: "La Canopée",
    title: "Le Don Unique",
    pnl_concept: "Mission",
    book_reference: "La PNL avec les enfants",
    fairy_speech: "Quel est son cadeau pour le monde ?",
    theory: "Au-delà de l'identité, il y a la Mission (ou Transpersonnel). À quoi sert l'enfant dans le grand système ? Est-il celui qui apporte la joie ? La structure ? L'innovation ? Aider l'enfant à sentir qu'il a une contribution unique à apporter au monde donne un sens inébranlable à sa vie.",
    quiz: [
      {
        question: "La Mission répond à la question :",
        options: ["Comment faire ?", "Pourquoi/Pour qui je le fais ?", "Combien ça coûte ?"],
        correctAnswer: 1
      },
      {
        question: "Connecter un enfant à sa mission :",
        options: ["Lui donne une estime de soi indestructible", "Le rend orgueilleux", "Est inutile"],
        correctAnswer: 0
      }
    ],
    real_mission: "Demandez : 'Si tu pouvais tout changer dans le monde avec une baguette magique, que ferais-tu ?'.",
    validation_message: "Tu as honoré sa lumière unique.",
    visual_asset: "Cime éblouissante."
  },
  {
    id: 22,
    phase: "La Canopée",
    title: "La Vision du Jardinier",
    pnl_concept: "Mission de Vie (Parent)",
    book_reference: "NLP for Parents",
    fairy_speech: "L'éducation n'est pas une série de techniques, c'est une mission d'âme.",
    theory: "Nous arrivons au sommet. Au-delà de votre rôle de parent (Identité), il y a votre Mission (Appartenance). Quel genre d'humains voulez-vous laisser à la Terre ? \n\nVotre 'Mission de Vie' parentale n'est pas d'avoir des enfants obéissants, mais d'élever des adultes libres, conscients et aimants. Chaque interaction quotidienne doit être alignée avec cette vision à long terme. Quand vous criez pour des chaussettes sales, êtes-vous au service de cette grande mission ? Reconnectez-vous à votre Vision à chaque instant difficile.",
    quiz: [
      {
        question: "La Mission de Vie se situe :",
        options: ["Au niveau de l'environnement (la maison)", "Au niveau des capacités (savoir faire)", "Au-dessus de l'identité (le sens, la contribution)"],
        correctAnswer: 2
      },
      {
        question: "Pourquoi avoir une vision ?",
        options: ["Pour que l'enfant obéisse", "Pour garder le cap dans les tempêtes du quotidien", "Pour être parfait"],
        correctAnswer: 1
      },
      {
        question: "Votre véritable rôle est :",
        options: ["Un policier", "Un ami", "Un jardinier d'âmes"],
        correctAnswer: 2
      }
    ],
    real_mission: "LA LETTRE DU FUTUR :\nÉcrivez une lettre à votre enfant tel que vous le visualisez à 20 ans. Décrivez ses qualités, sa force, son cœur. Lisez cette lettre chaque fois que vous doutez de votre mission. C'est votre Étoile du Nord.",
    validation_message: "Ton Arbre est complet. Tu as les racines, le tronc, et maintenant l'Étoile. Va, Grand Artiste, et cultive l'amour avec intelligence.",
    visual_asset: "L'Arbre de Vie complet et rayonnant."
  }
];


// --- SERVICES ---

// --- SERVICES ---

class UserDataService {
  static async saveEmail(email: string, name: string): Promise<void> {
    try {
      const response = await fetch('/api/save-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, timestamp: new Date().toISOString() })
      });
      
      if (!response.ok) {
        console.error("Erreur lors de l'enregistrement de l'email");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  }
  
  static async saveDelay(levelId: number, delayWeeks: number, userName: string): Promise<void> {
    try {
      const response = await fetch('/api/save-delay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          levelId, 
          delayWeeks, 
          userName,
          timestamp: new Date().toISOString() 
        })
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du délai:", error);
    }
  }
}

class FairyWisdomService {
  async askFairy(userQuery: string): Promise<string> {
    try {
      const reponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userQuery })
      });

      const data = await reponse.json();

      if (data.error) {
        console.error("Erreur du serveur:", data.error);
        return "La connexion avec le royaume magique est troublée...";
      }

      return data.text || "La poussière de fée brouille ma vision... Réessayez plus tard.";
      
    } catch (error) {
      console.error("Fairy error", error);
      return "Ma baguette magique se repose. Veuillez réessayer plus tard.";
    }
  }
}

const fairyService = new FairyWisdomService();

class TTSService {
  async getAudioContent(text: string): Promise<string | null> {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'fr-FR', name: 'fr-FR-Neural2-A' }, 
          audioConfig: { 
            audioEncoding: 'MP3', 
            pitch: -1.0, 
            speakingRate: 0.90 
          }
        }),
      });

      if (!response.ok) {
        console.error("Erreur HTTP TTS:", response.status);
        return null;
      }

      const data = await response.json();
      
      if (data.error) {
        console.error("Erreur Google TTS:", data.error);
        return null;
      }
      
      return data.audioContent; 
    } catch (e) {
      console.error("Erreur TTSService:", e);
      return null;
    }
  }
}

class AudioManager {
  private ttsService: TTSService;
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private onStatusChange: ((isPlaying: boolean) => void) | null = null;
  private audioContext: AudioContext | null = null;
  
  private ambienceNode: GainNode | null = null;
  private ambienceOscillator: AudioBufferSourceNode | null = null;
  private isAmbiencePlaying = false;
  private masterGain: GainNode | null = null;

  constructor() {
    this.ttsService = new TTSService();
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
    return this.audioContext;
  }

  public async unlockAudioContext(): Promise<void> {
    const ctx = this.getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
      console.log("🎵 AudioContext débloqué");
    }
  }

  private createPinkNoise(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
    }
    return buffer;
  }

  async playAmbience() {
    if (this.isAmbiencePlaying) return;
    try {
      const ctx = this.getAudioContext();
      if (ctx.state === 'suspended') await ctx.resume();

      const noiseBuffer = this.createPinkNoise(ctx);
      this.ambienceOscillator = ctx.createBufferSource();
      this.ambienceOscillator.buffer = noiseBuffer;
      this.ambienceOscillator.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 300;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      this.ambienceNode = ctx.createGain();
      this.ambienceNode.gain.value = 0.05;

      this.masterGain = ctx.createGain();
      this.masterGain.gain.value = 1.0;

      this.ambienceOscillator.connect(filter);
      filter.connect(this.ambienceNode);
      this.ambienceNode.connect(this.masterGain);
      this.masterGain.connect(ctx.destination);

      this.ambienceOscillator.start();
      this.isAmbiencePlaying = true;
    } catch (e) {
      console.warn("Ambience failed", e);
    }
  }

  setStatusListener(listener: (isPlaying: boolean) => void) {
    this.onStatusChange = listener;
  }

  playMagicSound(type: 'click_soft' | 'portal_open' | 'success_chime' | 'level_unlock' | 'error') {
    try {
      const ctx = this.getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const t = ctx.currentTime;
      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);

      if (type === 'click_soft') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.1);
        gainNode.gain.setValueAtTime(0.1, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(gainNode);
        osc.start(t);
        osc.stop(t + 0.1);
      } else if (type === 'success_chime') {
        const notes = [523.25, 659.25, 783.99, 1046.50]; 
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          osc.connect(oscGain);
          oscGain.connect(ctx.destination);
          oscGain.gain.setValueAtTime(0, t);
          oscGain.gain.linearRampToValueAtTime(0.05, t + 0.05 + (i * 0.05));
          oscGain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
          osc.start(t);
          osc.stop(t + 2.0);
        });
      } else if (type === 'level_unlock') {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 1.0);
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(0.1, t + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, t + 1.0);
        osc.connect(gainNode);
        osc.start(t);
        osc.stop(t + 1.0);
      } else if (type === 'portal_open') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(50, t);
        osc.frequency.linearRampToValueAtTime(150, t + 2.5);
        gainNode.gain.setValueAtTime(0.3, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 3.0);
        osc.connect(gainNode);
        osc.start(t);
        osc.stop(t + 3.0);
        this.playAmbience();
      } else if (type === 'error') {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.3);
        gainNode.gain.setValueAtTime(0.2, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(gainNode);
        osc.start(t);
        osc.stop(t + 0.3);
      }
    } catch (e) {
      console.warn("AudioContext error", e);
    }
  }

  async playFairyVoice(text: string) {
    this.stop();
    if (this.onStatusChange) this.onStatusChange(true);

    await this.unlockAudioContext();

    if (this.ambienceNode) {
       this.ambienceNode.gain.setTargetAtTime(0.01, this.getAudioContext().currentTime, 0.5);
    }

    const audioContent = await this.ttsService.getAudioContent(text);
    
    if (audioContent) {
      const audioSrc = `data:audio/mp3;base64,${audioContent}`;
      this.currentAudio = new Audio(audioSrc);
      
      this.currentAudio.onended = () => {
        this.isPlaying = false;
        if (this.onStatusChange) this.onStatusChange(false);
        if (this.ambienceNode) {
            this.ambienceNode.gain.setTargetAtTime(0.05, this.getAudioContext().currentTime, 1.0);
        }
      };

      this.currentAudio.onerror = (e) => {
        console.error("Erreur lecture audio:", e);
        this.isPlaying = false;
        if (this.onStatusChange) this.onStatusChange(false);
        if (this.ambienceNode) {
            this.ambienceNode.gain.setTargetAtTime(0.05, this.getAudioContext().currentTime, 1.0);
        }
      }

      try {
        await this.currentAudio.play();
        this.isPlaying = true;
      } catch (e) {
        console.error("Playback failed", e);
        this.isPlaying = false;
        if (this.onStatusChange) this.onStatusChange(false);
      }
    } else {
        console.error("Aucun contenu audio reçu");
        this.isPlaying = false;
        if (this.onStatusChange) this.onStatusChange(false);
        if (this.ambienceNode) {
            this.ambienceNode.gain.setTargetAtTime(0.05, this.getAudioContext().currentTime, 1.0);
        }
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.isPlaying = false;
    if (this.onStatusChange) this.onStatusChange(false);
    if (this.ambienceNode) {
       this.ambienceNode.gain.setTargetAtTime(0.05, this.getAudioContext().currentTime, 0.5);
    }
  }
}

const audioManager = new AudioManager();

// --- VISUAL COMPONENTS ---

const GOLDEN_THEME = {
  colors: {
    bgStart: '#1a0b2e',
    bgEnd: '#000000',
    text: '#f0e6d2',
    gold: '#ffd700',
    goldDim: 'rgba(255, 215, 0, 0.6)',
    parchment: '#f0e6d2',
    glass: 'rgba(20, 10, 30, 0.85)',
    inputBg: 'rgba(0, 0, 0, 0.6)',
  },
  fonts: {
    body: 'Quicksand, system-ui, sans-serif',
    header: 'Cinzel, Georgia, serif',
  }
};

const GoldenButton = ({ onClick, children, disabled = false, style = {} }: { onClick: () => void, children?: React.ReactNode, disabled?: boolean, style?: React.CSSProperties }) => (
  <button 
    className="btn-golden" 
    onClick={onClick} 
    disabled={disabled}
    style={{ opacity: disabled ? 0.5 : 1, ...style }}
  >
    {children}
  </button>
);

const MagicCard = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => (
  <div className={`magic-card ${className}`}>
    {children}
  </div>
);

const TypewriterText = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
};

const getTreePhase = (level: number) => {
    if (level <= 5) return 1;
    if (level <= 10) return 2;
    return 3;
};

const canShowMagicMirror = (level: number) => level >= 10;

// --- SCREENS ---

// 1. PORTAL SCREEN avec email
const PortalScreen = ({ onEnter }: { onEnter: (name: string, count: string, email: string) => void }) => {
  const [name, setName] = useState('');
  const [childrenCount, setChildrenCount] = useState('');
  const [email, setEmail] = useState('');
  const [imgError, setImgError] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('grandArtName');
    const savedCount = localStorage.getItem('grandArtChildCount');
    const savedEmail = localStorage.getItem('grandArtEmail');
    if (savedName) setName(savedName);
    if (savedCount) setChildrenCount(savedCount);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleOpen = async () => {
  if (name.trim().length > 0 && email.trim().length > 0 && email.includes('@')) {
    audioManager.playMagicSound('portal_open');
    setIsOpening(true);
    
    // 👇 Appelez directement la fonction onEnter (qui elle-même appelle saveEmail)
    setTimeout(() => {
      onEnter(name, childrenCount, email);
    }, 2000); 
  } else {
    audioManager.playMagicSound('error');
    alert("Veuillez renseigner votre nom et une adresse email valide.");
  }
};

  return (
    <div style={{
      position: 'relative', height: '100vh', width: '100%', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
        background: `radial-gradient(circle at center, ${GOLDEN_THEME.colors.bgStart}, ${GOLDEN_THEME.colors.bgEnd})`
      }}>
         {!imgError && (
           <img 
             src="assets/images/enchanted_portal.png" 
             alt="Portail Magique"
             style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
             onError={() => setImgError(true)}
           />
         )}
      </div>

      <div className={`portal-content ${isOpening ? 'fade-out' : 'fade-in'}`} style={{ zIndex: 10, textAlign: 'center', maxWidth: '400px', width: '90%' }}>
        <h1 className="golden-text" style={{ fontFamily: GOLDEN_THEME.fonts.header, fontSize: '3.5rem', marginBottom: '2rem', textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>Le Grimoire Parental</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
          <div className="input-wrapper">
             <input 
              type="text" 
              placeholder="Votre Nom" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="magical-input"
            />
          </div>
          <div className="input-wrapper">
            <input 
              type="number" 
              placeholder="Nombre d'enfants" 
              value={childrenCount}
              onChange={(e) => setChildrenCount(e.target.value)}
              className="magical-input"
            />
          </div>
          <div className="input-wrapper">
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="magical-input"
            />
          </div>
        </div>
        
        <GoldenButton onClick={handleOpen}>Ouvrir le Grimoire</GoldenButton>
      </div>
    </div>
  );
};

// 2. MAGIC MIRROR (CHAT)
const MagicMirror = ({ onClose }: { onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');
    audioManager.playMagicSound('click_soft');
    const answer = await fairyService.askFairy(query);
    setLoading(false);
    setResponse(answer);
    audioManager.playMagicSound('success_chime');
  };

  return (
    <div className="fade-in" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div className="magic-card glass-panel" style={{ width: '100%', maxWidth: '500px', minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${GOLDEN_THEME.colors.goldDim}`, paddingBottom: '10px', marginBottom: '15px' }}>
             <h2 className="golden-text" style={{ margin: 0 }}>Miroir Magique</h2>
             <button onClick={onClose} style={{ background: 'none', border: 'none', color: GOLDEN_THEME.colors.gold, fontSize: '2rem', cursor: 'pointer' }}>&times;</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
           {loading ? (
             <p style={{ color: GOLDEN_THEME.colors.gold, textAlign: 'center', fontStyle: 'italic' }}>✨ Les étoiles s'alignent... ✨</p>
           ) : response ? (
             <div style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#fff' }}>
                <TypewriterText text={response} />
             </div>
           ) : (
             <p style={{ opacity: 0.6, textAlign: 'center', fontStyle: 'italic' }}>"Pose ta question, âme courageuse. Je t'écoute..."</p>
           )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Écrivez votre question..."
            className="magical-input"
            style={{ flex: 1 }}
          />
          <button onClick={handleAsk} disabled={loading} style={{ background: GOLDEN_THEME.colors.gold, border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(255,215,0,0.5)' }}>
             <span style={{ fontSize: '1.5rem' }}>✨</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. TREE OF LIFE COMPONENT
const TreeOfLife = ({ level }: { level: number }) => {
  const phase = getTreePhase(level);
  const [imgError, setImgError] = useState(false);
  const imagePath = `assets/images/tree_phase_${phase}.png`;

  useEffect(() => {
    setImgError(false);
  }, [phase]);

  return (
    <div style={{ width: '280px', height: '350px', margin: '0 auto 20px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!imgError ? (
         <img 
           src={imagePath} 
           alt={`Arbre Phase ${phase}`}
           onError={() => setImgError(true)}
           style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.4))', animation: 'float 6s ease-in-out infinite' }}
         />
      ) : (
         <svg viewBox="0 0 200 250" style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.3))' }}>
          <g opacity={level >= 1 ? 1 : 0.3} stroke={GOLDEN_THEME.colors.gold} strokeWidth="2" fill="none">
             <path d="M100,200 Q100,220 80,240" strokeDasharray="100" strokeDashoffset={level >= 2 ? 0 : 100} style={{ transition: 'all 2s' }} />
             <path d="M100,200 Q100,220 120,240" strokeDasharray="100" strokeDashoffset={level >= 3 ? 0 : 100} style={{ transition: 'all 2s' }} />
             <path d="M100,200 Q100,230 100,250" strokeDasharray="100" strokeDashoffset={level >= 4 ? 0 : 100} style={{ transition: 'all 2s' }} />
          </g>
          <path d="M100,200 L100,100" stroke={GOLDEN_THEME.colors.gold} strokeWidth="6" fill="none" strokeDasharray="100" strokeDashoffset={level >= 6 ? 0 : 100} opacity={level >= 5 ? 1 : 0.3} style={{ transition: 'all 2s' }} />
          <g opacity={level >= 11 ? 1 : 0} stroke={GOLDEN_THEME.colors.gold} strokeWidth="3" fill="none">
             <path d="M100,150 Q70,120 60,80" strokeDasharray="100" strokeDashoffset={level >= 12 ? 0 : 100} style={{ transition: 'all 2s' }} />
             <path d="M100,130 Q130,100 140,70" strokeDasharray="100" strokeDashoffset={level >= 13 ? 0 : 100} style={{ transition: 'all 2s' }} />
             <path d="M100,100 Q100,70 100,50" strokeDasharray="100" strokeDashoffset={level >= 14 ? 0 : 100} style={{ transition: 'all 2s' }} />
          </g>
          <g opacity={level >= 16 ? 1 : 0} fill={GOLDEN_THEME.colors.goldDim}>
             <circle cx="60" cy="80" r={level >= 17 ? 10 : 0} style={{ transition: 'all 1s' }} />
             <circle cx="140" cy="70" r={level >= 18 ? 12 : 0} style={{ transition: 'all 1s' }} />
             <circle cx="100" cy="50" r={level >= 19 ? 15 : 0} style={{ transition: 'all 1s' }} />
             <circle cx="80" cy="110" r={level >= 20 ? 8 : 0} style={{ transition: 'all 1s' }} />
             <circle cx="120" cy="100" r={level >= 21 ? 8 : 0} style={{ transition: 'all 1s' }} />
          </g>
          <g opacity={level >= 22 ? 1 : 0} style={{ transition: 'opacity 2s' }}>
             <polygon points="100,20 105,35 120,35 110,45 115,60 100,50 85,60 90,45 80,35 95,35" fill="#fff" stroke={GOLDEN_THEME.colors.gold} strokeWidth="2">
               <animateTransform attributeName="transform" type="rotate" from="0 100 40" to="360 100 40" dur="10s" repeatCount="indefinite" />
             </polygon>
          </g>
        </svg>
      )}
    </div>
  );
};

const MapScreen = ({ maxReachedLevel, onStartLevel, userName }: { maxReachedLevel: number, onStartLevel: (levelId: number) => void, userName: string }) => {
  const [selectedLevelId, setSelectedLevelId] = useState(maxReachedLevel);
  const [showMirror, setShowMirror] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  
  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenMirrorUnlock') === 'true';
    if (maxReachedLevel >= 10 && !hasSeen) {
      setTimeout(() => {
        setShowUnlockDialog(true);
        audioManager.playMagicSound('success_chime');
      }, 500);
    }
  }, [maxReachedLevel]);

  const handleCloseUnlock = () => {
    localStorage.setItem('hasSeenMirrorUnlock', 'true');
    setShowUnlockDialog(false);
  };

  useEffect(() => {
    if (selectedLevelId > maxReachedLevel) setSelectedLevelId(maxReachedLevel);
  }, [maxReachedLevel]);

  const selectedLevel = LEVELS.find(l => l.id === selectedLevelId) || LEVELS[0];
  const progress = (maxReachedLevel / LEVELS.length) * 100;
  const showMagicMirrorBtn = canShowMagicMirror(maxReachedLevel);

  const handlePrev = () => {
    if (selectedLevelId > 1) {
      audioManager.playMagicSound('click_soft');
      setSelectedLevelId(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (selectedLevelId < maxReachedLevel) {
      audioManager.playMagicSound('click_soft');
      setSelectedLevelId(prev => prev + 1);
    }
  };

  return (
    <div className="screen-fade-in" style={{ width: '100%', maxWidth: '600px', textAlign: 'center', padding: '20px', position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '20px', marginTop: '20px' }}>
        <h1 className="golden-text" style={{ fontFamily: GOLDEN_THEME.fonts.header, fontSize: '2rem', margin: 0 }}>Le Grimoire Parental</h1>
        <p style={{ color: GOLDEN_THEME.colors.goldDim, letterSpacing: '2px', fontSize: '0.9rem' }}>Voyage de {userName}</p>
      </header>

      <TreeOfLife level={maxReachedLevel} />

      <div style={{ marginBottom: '30px' }}>
        <p style={{ color: GOLDEN_THEME.colors.goldDim, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '5px' }}>
          Phase : {getTreePhase(selectedLevelId)}
        </p>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', margin: '10px auto', maxWidth: '300px' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: GOLDEN_THEME.colors.gold, borderRadius: '2px', transition: 'width 1s ease' }}></div>
        </div>
      </div>
      
      <MagicCard className="level-selector">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={handlePrev} 
            disabled={selectedLevelId <= 1}
            style={{ background: 'transparent', border: 'none', color: GOLDEN_THEME.colors.gold, fontSize: '1.5rem', cursor: 'pointer', opacity: selectedLevelId <= 1 ? 0.3 : 1 }}
          >
            &#8592;
          </button>
          
          <div style={{ flex: 1, padding: '0 10px' }}>
             <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Niveau {selectedLevel.id}</h3>
             <p style={{ margin: '5px 0 0', color: GOLDEN_THEME.colors.gold, fontSize: '0.9rem' }}>{selectedLevel.title}</p>
          </div>
          
          <button 
            onClick={handleNext} 
            disabled={selectedLevelId >= maxReachedLevel}
            style={{ background: 'transparent', border: 'none', color: GOLDEN_THEME.colors.gold, fontSize: '1.5rem', cursor: 'pointer', opacity: selectedLevelId >= maxReachedLevel ? 0.3 : 1 }}
          >
            &#8594;
          </button>
        </div>
      </MagicCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <GoldenButton onClick={() => onStartLevel(selectedLevelId)}>
          {selectedLevelId === maxReachedLevel && maxReachedLevel <= LEVELS.length ? "Continuer le Voyage" : "Rejouer ce Niveau"}
        </GoldenButton>
      </div>

      {showMagicMirrorBtn && (
        <button 
          onClick={() => setShowMirror(true)} 
          className="fab-mirror"
          title="Demander à la Fée"
        >
          🔮
        </button>
      )}

      {showMirror && <MagicMirror onClose={() => setShowMirror(false)} />}

      {showUnlockDialog && (
        <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
           <MagicCard>
             <h2 className="golden-text" style={{ textAlign: 'center', marginTop: 0 }}>Une présence magique...</h2>
             <p style={{ lineHeight: '1.6', textAlign: 'center' }}>
               Félicitations ! Votre dévouement a éveillé l'esprit du Grimoire. La Fée Marraine est désormais à vos côtés. Cliquez sur le Miroir Magique (🔮) pour lui confier vos doutes et recevoir sa sagesse ancestrale.
             </p>
             <div style={{ textAlign: 'center', marginTop: '20px' }}>
               <GoldenButton onClick={handleCloseUnlock}>Merci</GoldenButton>
             </div>
           </MagicCard>
        </div>
      )}
    </div>
  );
};

// 4. LEVEL DETAIL SCREEN avec flèches de retour et demande de délai
const LevelDetailScreen = ({ level, onComplete, onBack, saveDelay }: { level: Level, onComplete: () => void, onBack: () => void, saveDelay: any }) => {
  const [step, setStep] = useState<'theory' | 'quiz' | 'mission' | 'delay'>('theory');
  const [quizIndex, setQuizIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedDelay, setSelectedDelay] = useState<number | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
     audioManager.setStatusListener(setIsAudioPlaying);
     const savedName = localStorage.getItem('grandArtName') || '';
     setUserName(savedName);
     return () => audioManager.setStatusListener(() => {});
  }, []);

  const handleQuizAnswer = (optionIndex: number) => {
    const currentQ = level.quiz[quizIndex];
    if (optionIndex === currentQ.correctAnswer) {
      audioManager.playMagicSound('click_soft');
      if (quizIndex < level.quiz.length - 1) {
        setQuizIndex(prev => prev + 1);
      } else {
        audioManager.playMagicSound('level_unlock');
        setStep('mission');
      }
    } else {
      audioManager.playMagicSound('error');
      alert("Ce n'est pas tout à fait ça. Réessayez, noble parent.");
    }
  };

  const handleDelaySelection = (weeks: number) => {
    setSelectedDelay(weeks);
  };

  const handleConfirmDelay = async () => {
  if (selectedDelay) {
    try {
      await saveDelay({ 
        levelId: level.id, 
        delayDays: selectedDelay,  // Note : la variable s'appelle encore delayWeeks mais stocke des jours
        userName,
        timestamp: new Date().toISOString() 
      });
      audioManager.playMagicSound('success_chime');
      
      // Message personnalisé selon le délai
      let delayText = '';
      if (selectedDelay === 1) delayText = '1 jour';
      else if (selectedDelay === 3) delayText = '3 jours';
      else delayText = '1 semaine';
      
      alert(`Merci ! Vous avez choisi de pratiquer pendant ${delayText}. La magie opérera à son rythme.`);
      setStep('delay');
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue");
    }
  } else {
    alert("Veuillez choisir un délai pour votre pratique.");
  }
};

  const toggleVoice = async () => {
    if (isAudioPlaying) {
      audioManager.stop();
    } else {
      await audioManager.playFairyVoice(level.fairy_speech);
    }
  };

  const goBackToTheory = () => {
    setStep('theory');
    audioManager.playMagicSound('click_soft');
  };

  return (
    <div className="screen-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', color: GOLDEN_THEME.colors.gold, fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          ← Retour
        </button>
        <span style={{ color: GOLDEN_THEME.colors.goldDim, fontSize: '0.8rem' }}>NIVEAU {level.id}</span>
        <div style={{ display: 'flex', gap: '5px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step === 'theory' ? GOLDEN_THEME.colors.gold : '#555' }}></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step === 'quiz' ? GOLDEN_THEME.colors.gold : '#555' }}></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step === 'mission' ? GOLDEN_THEME.colors.gold : '#555' }}></div>
        </div>
      </div>

      <MagicCard>
        <h2 className="golden-text" style={{ fontFamily: GOLDEN_THEME.fonts.header, textAlign: 'center', marginTop: 0 }}>
          {level.title}
        </h2>

        {step === 'theory' && (
          <div className="fade-in">
             <div style={{ textAlign: 'center', marginBottom: '15px' }}>
               <button className={`voice-btn ${isAudioPlaying ? 'playing' : ''}`} onClick={toggleVoice}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
               </button>
               <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#ddd' }}>"{level.fairy_speech}"</p>
             </div>
             <h3 style={{ color: GOLDEN_THEME.colors.gold, borderBottom: '1px solid #444', paddingBottom: '5px' }}>Savoir</h3>
             <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{level.theory}</p>
             <div style={{ textAlign: 'center', marginTop: '30px' }}>
               <GoldenButton onClick={() => { audioManager.playMagicSound('click_soft'); setStep('quiz'); }}>J'ai Compris</GoldenButton>
             </div>
          </div>
        )}

        {step === 'quiz' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button 
                onClick={goBackToTheory}
                style={{ background: 'transparent', border: 'none', color: GOLDEN_THEME.colors.goldDim, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                ← Revoir la théorie
              </button>
              <h3 style={{ color: GOLDEN_THEME.colors.gold, margin: 0 }}>Vérification ({quizIndex + 1}/{level.quiz.length})</h3>
            </div>
            {level.quiz.length > 0 ? (
              <>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>{level.quiz[quizIndex].question}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {level.quiz[quizIndex].options.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleQuizAnswer(idx)}
                      style={{ 
                        padding: '15px', 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid #555', 
                        color: '#fff', 
                        borderRadius: '5px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: GOLDEN_THEME.fonts.body
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p>Passez directement à l'action.</p>
                <GoldenButton onClick={() => setStep('mission')}>Continuer</GoldenButton>
              </div>
            )}
          </div>
        )}

        {step === 'mission' && (
          <div className="fade-in">
            <h3 style={{ color: GOLDEN_THEME.colors.gold, textAlign: 'center' }}>Votre Mission</h3>
            <div style={{ background: 'rgba(255, 215, 0, 0.1)', padding: '20px', borderRadius: '10px', border: `1px solid ${GOLDEN_THEME.colors.goldDim}`, marginBottom: '30px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center', whiteSpace: 'pre-wrap' }}>{level.real_mission}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
               <GoldenButton onClick={() => setStep('delay')}>Mission Acceptée</GoldenButton>
            </div>
          </div>
        )}

        {step === 'delay' && (
  <div className="fade-in">
    <h3 style={{ color: GOLDEN_THEME.colors.gold, textAlign: 'center' }}>Un moment pour la pratique</h3>
    <p style={{ textAlign: 'center', marginBottom: '20px' }}>
      Pour que la magie opère, accordez-vous un temps de mise en pratique.
    </p>
    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
      {/* Modifiez les boutons ici */}
      <button
        onClick={() => handleDelaySelection(1)}
        style={{
          padding: '15px 25px',
          background: selectedDelay === 1 ? GOLDEN_THEME.colors.gold : 'rgba(255,215,0,0.1)',
          border: `1px solid ${GOLDEN_THEME.colors.gold}`,
          color: selectedDelay === 1 ? '#1a0b2e' : GOLDEN_THEME.colors.gold,
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: GOLDEN_THEME.fonts.header,
          fontWeight: 'bold',
          transition: 'all 0.3s'
        }}
      >
        ☀️ 1 jour
      </button>
      
      <button
        onClick={() => handleDelaySelection(3)}
        style={{
          padding: '15px 25px',
          background: selectedDelay === 3 ? GOLDEN_THEME.colors.gold : 'rgba(255,215,0,0.1)',
          border: `1px solid ${GOLDEN_THEME.colors.gold}`,
          color: selectedDelay === 3 ? '#1a0b2e' : GOLDEN_THEME.colors.gold,
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: GOLDEN_THEME.fonts.header,
          fontWeight: 'bold',
          transition: 'all 0.3s'
        }}
      >
        🌙 3 jours
      </button>
      
      <button
        onClick={() => handleDelaySelection(7)}
        style={{
          padding: '15px 25px',
          background: selectedDelay === 7 ? GOLDEN_THEME.colors.gold : 'rgba(255,215,0,0.1)',
          border: `1px solid ${GOLDEN_THEME.colors.gold}`,
          color: selectedDelay === 7 ? '#1a0b2e' : GOLDEN_THEME.colors.gold,
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: GOLDEN_THEME.fonts.header,
          fontWeight: 'bold',
          transition: 'all 0.3s'
        }}
      >
        📅 1 semaine
      </button>
    </div>
    <div style={{ textAlign: 'center' }}>
      <GoldenButton onClick={handleConfirmDelay} disabled={!selectedDelay}>
        Confirmer et continuer
      </GoldenButton>
    </div>
  </div>
)}

      </MagicCard>
    </div>
  );
};

// --- APP ORCHESTRATOR ---

const App = () => {
  const [screen, setScreen] = useState<'portal' | 'map' | 'level'>('portal');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [maxReachedLevel, setMaxReachedLevel] = useState(1);
  const [currentPlayingLevelId, setCurrentPlayingLevelId] = useState(1);

  // 👇 Ajoutez ces deux lignes
  const saveEmail = useMutation(api.emails.saveEmail);
  const saveDelay = useMutation(api.delays.saveDelay);

  useEffect(() => {
    const savedName = localStorage.getItem('grandArtName');
    const savedLevel = localStorage.getItem('grandArtLevel');
    
    if (savedName) {
      setUserName(savedName);
      setScreen('map'); 
    }
    if (savedLevel) {
      setMaxReachedLevel(parseInt(savedLevel, 10));
    }
  }, []);

  const handlePortalEnter = async (name: string, count: string, email: string) => {
  localStorage.setItem('grandArtName', name);
  localStorage.setItem('grandArtChildCount', count);
  localStorage.setItem('grandArtEmail', email);
  setUserName(name);
  setUserEmail(email);
  
  try {
    await saveEmail({ 
      email, 
      name, 
      timestamp: new Date().toISOString() 
    });
    console.log("✅ Email enregistré avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement:", error);
  }
  
  setScreen('map');
};

  const handleStartLevel = (levelId: number) => {
    if (levelId > LEVELS.length) {
       if(confirm("Recommencer le voyage ?")) {
         setMaxReachedLevel(1);
         localStorage.setItem('grandArtLevel', '1');
         localStorage.removeItem('hasSeenMirrorUnlock');
         setCurrentPlayingLevelId(1);
         setScreen('level');
       }
    } else {
       audioManager.playMagicSound('click_soft');
       setCurrentPlayingLevelId(levelId);
       setScreen('level');
    }
  };

  const handleLevelComplete = () => {
    audioManager.playMagicSound('success_chime');
    
    if (currentPlayingLevelId === maxReachedLevel) {
      const nextLevel = maxReachedLevel + 1;
      setMaxReachedLevel(nextLevel);
      localStorage.setItem('grandArtLevel', nextLevel.toString());
    }
    
    setTimeout(() => {
        setScreen('map');
    }, 1500);
  };

  const handleBackToMap = () => {
    setScreen('map');
  };

  const currentLevelData = LEVELS.find(l => l.id === currentPlayingLevelId) || LEVELS[0];

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(circle at center top, ${GOLDEN_THEME.colors.bgStart} 0%, ${GOLDEN_THEME.colors.bgEnd} 100%)`,
      color: GOLDEN_THEME.colors.text,
      fontFamily: GOLDEN_THEME.fonts.body,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <style>{`
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .golden-text { background: linear-gradient(to bottom, #ffd700, #b8860b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0px 2px 4px rgba(0,0,0,0.5); color: #ffd700; }
        .btn-golden { background: linear-gradient(135deg, #ffd700, #b8860b); border: 1px solid #ffd700; color: #1a0b2e; padding: 12px 24px; font-family: ${GOLDEN_THEME.fonts.header}; font-weight: bold; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .btn-golden:hover { transform: scale(1.05); box-shadow: 0 0 25px rgba(255, 215, 0, 0.6); }
        .magic-card { background: rgba(20, 10, 30, 0.8); border: 1px solid rgba(255, 215, 0, 0.2); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 10px; padding: 30px; margin-bottom: 20px; position: relative; overflow: hidden; }
        .magic-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent); }
        .glass-panel { background: ${GOLDEN_THEME.colors.glass}; border: 1px solid ${GOLDEN_THEME.colors.goldDim}; }
        
        .voice-btn { background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.6); color: #ffd700; border-radius: 50%; width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
        .voice-btn:hover { background: rgba(255, 215, 0, 0.3); transform: scale(1.1); }
        .voice-btn.playing { box-shadow: 0 0 15px #ffd700; animation: pulse-glow 2s infinite; }
        @keyframes pulse-glow { 0% { box-shadow: 0 0 10px rgba(255,215,0,0.6); } 50% { box-shadow: 0 0 25px #ffd700; } 100% { box-shadow: 0 0 10px rgba(255,215,0,0.6); } }

        .magical-input {
          background: ${GOLDEN_THEME.colors.inputBg};
          border: 1px solid ${GOLDEN_THEME.colors.gold};
          color: #fff;
          font-family: 'Quicksand', sans-serif;
          font-size: 1.1rem;
          padding: 12px 20px;
          border-radius: 8px;
          width: 100%;
          outline: none;
          box-shadow: 0 2px 5px rgba(0,0,0,0.5);
          transition: all 0.3s;
        }
        .magical-input:focus {
          box-shadow: 0 0 10px ${GOLDEN_THEME.colors.goldDim};
          background: rgba(0, 0, 0, 0.8);
        }
        
        .input-wrapper { width: 100%; }

        .fab-mirror {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffd700, #b8860b);
          border: 2px solid #fff;
          box-shadow: 0 0 20px rgba(255,215,0,0.6);
          cursor: pointer;
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 90;
          transition: transform 0.3s;
        }
        .fab-mirror:hover {
          transform: scale(1.1) rotate(10deg);
        }

        .fade-out { opacity: 0; transition: opacity 1s ease-out; pointer-events: none; }
        .fade-in { animation: fadeIn 0.8s ease-in; }
        .screen-fade-in { animation: screenFade 1.2s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes screenFade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {screen === 'portal' && <PortalScreen onEnter={handlePortalEnter} />}
      
      {screen === 'map' && <MapScreen maxReachedLevel={maxReachedLevel} userName={userName} onStartLevel={handleStartLevel} />}
      
      {screen === 'level' && <LevelDetailScreen level={currentLevelData} onComplete={handleLevelComplete} onBack={handleBackToMap} saveDelay={saveDelay} />}

      <footer style={{ marginTop: 'auto', padding: '20px', fontSize: '0.7rem', opacity: 0.4, position: 'relative', zIndex: 10 }}>
        © Le Grimoire Parental - Architecture Pédagogique
      </footer>
    </div>
  );
};

// Initialiser le client Convex
// L'URL doit venir de l'environnement ou d'une valeur par défaut
const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://adventurous-starfish-166.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

const root = createRoot(document.getElementById('root')!);
root.render(
  <ConvexProvider client={convex}>
    <App />
  </ConvexProvider>
);
