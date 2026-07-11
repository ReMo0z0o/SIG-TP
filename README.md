# BPMN & ArchiMate — Comprendre et réussir les TP (ECGEB210)

Site d'apprentissage interactif construit à partir des supports officiels du cours
**Systèmes d'information de gestion (ECGEB210, Université de Namur)** : les TP BPMN (TP1, TP2),
le TP ArchiMate (TP3), la fiche récapitulative ArchiMate et les slides de théorie (3_BPM, 4_EA).

## Lancer le site

Aucune installation, aucun build : c'est un site 100 % statique.

```bash
# Option 1 — ouvrir directement
ouvrir index.html dans un navigateur

# Option 2 — petit serveur local
python3 -m http.server 8000
# puis http://localhost:8000
```

Compatible GitHub Pages : il suffit d'activer Pages sur la branche pour publier le site.

## Contenu

| Module | Contenu |
|---|---|
| **Théorie du cours** | Les 6 chapitres du cours magistral : Introduction aux SIG, SDLC, BPM, TOGAF & ArchiMate, Théories des SI (apps de révision autonomes dans `theorie/`) + Conclusion orientée examen, avec suivi de progression par chapitre |
| **Théorie BPMN** | Événements, tâches, flux, pools/lanes, gateways (avec **simulateur de jetons**), sous-processus, boucles/multi-instances, événements frontière (scénario animé) + quiz |
| **TP1 — BPMN de base** | Les 9 exercices officiels : 6 lectures de diagrammes interactives (tableaux Oui/Non, QCM, simulation de la boucle infinie) + 3 modélisations (commande, plaintes, Event Bureau) avec **solutions construites étape par étape** |
| **TP2 — BPMN avancé** | Hypothèques (gateway événementiel), recrutement (boucle & multi-instance), clients défaillants (timers frontière non-interruptibles) — énoncés officiels, corrections pas à pas |
| **Théorie ArchiMate** | Les 3 couches, tous les éléments de la fiche récapitulative, les 11 relations et leurs flèches, l'exemple ArchiSurance commenté |
| **TP3 — ArchiMate** | Expliquer un diagramme (réponse modèle), **2 chasses aux erreurs cliquables** (FoodExpress, location de véhicules), analyse de consultant (EasyPharm) |
| **Examen blanc** | 20 questions mélangées avec explications détaillées |

## Fonctionnalités

- **Diagrammes SVG natifs** : tous les diagrammes des corrections sont redessinés vectoriellement
  (moteurs de rendu maison `js/lib/bpmn.js` et `js/lib/archi.js`), fidèles aux correctifs officiels.
- **Simulation de jetons** : animations pédagogiques (XOR/AND/OR, boucle infinie, événements frontière).
- **Corrections guidées** : chaque solution de modélisation se construit étape par étape, avec la
  justification de chaque choix (pourquoi ce gateway, pourquoi ce type d'événement…).
- **Suivi de progression** : sauvegardé en local (localStorage), visible par module dans la barre latérale.
- **Thème clair/sombre**, responsive, accessible au clavier.

## Structure du code

```
index.html            Coquille de l'application (SPA à routage par hash)
css/style.css         Design system (tokens, thèmes clair/sombre)
js/app.js             Routeur, progression, navigation
js/lib/bpmn.js        Moteur de rendu SVG BPMN 2.0 + jetons animés
js/lib/archi.js       Moteur de rendu SVG ArchiMate 3.x
js/lib/quiz.js        Moteur d'exercices (QCM, tableaux, hotspots, étapes, questions ouvertes)
js/views/*.js         Les 7 pages de contenu
```

> Ce site est un outil d'entraînement : en cas de divergence, les supports officiels du cours font foi.
