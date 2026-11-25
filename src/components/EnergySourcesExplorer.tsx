import {type KeyboardEvent, useState} from 'react';

type EnergyFamily = 'renouvelable' | 'non-renouvelable';
type RenewableSourceId = 'soleil' | 'vent' | 'eau' | 'terre' | 'vegetaux';
type NonRenewableSourceId = 'petrole' | 'charbon' | 'gaz' | 'uranium';
type SourceId = RenewableSourceId | NonRenewableSourceId;
type StageId = 'ressource' | 'extraction' | 'convertisseur' | 'transport';

interface StageContent {
  label: string;
  title: string;
  text: string;
  /** Coordinates in viewBox 840x350 for hotspot marker & flow path */
  x: number;
  y: number;
}

interface SourceInfo {
  id: SourceId;
  family: EnergyFamily;
  name: string;
  converterShort: string;
  emissionLabel: string;
  conversionFormula: string;
  stages: Record<StageId, StageContent>;
}

const SOURCES: Record<SourceId, SourceInfo> = {
  soleil: {
    id: 'soleil',
    family: 'renouvelable',
    name: 'Soleil',
    converterShort: 'Panneaux photovoltaïques',
    emissionLabel: 'Peu émettrice de gaz à effet de serre',
    conversionFormula: 'Énergie lumineuse → Énergie électrique',
    stages: {
      ressource: {
        label: 'Ressource',
        title: 'Soleil (énergie lumineuse)',
        text: 'Le Soleil est une immense boule de gaz chaud (15 millions de °C en son cœur). Il fournit à la Terre 10 000 fois plus d’énergie que ce que consomme l’humanité, mais uniquement le jour et selon la météo.',
        x: 92,
        y: 62,
      },
      extraction: {
        label: 'Captage',
        title: 'Rayonnement solaire direct',
        text: 'La lumière du Soleil arrive jusqu’aux toits et aux centrales solaires sans avoir besoin d’être extraite du sous-sol ni transportée par camion.',
        x: 175,
        y: 120,
      },
      convertisseur: {
        label: 'Convertisseur',
        title: 'Panneaux photovoltaïques',
        text: 'Les panneaux solaires photovoltaïques captent l’énergie lumineuse du Soleil et la transforment directement en énergie électrique.',
        x: 245,
        y: 192,
      },
      transport: {
        label: 'Transport',
        title: 'Transport d’électricité',
        text: 'L’électricité produite rejoint le réseau de distribution. En France, sur 106 000 km de lignes électriques, environ 6 % des grandes lignes sont enterrées.',
        x: 705,
        y: 162,
      },
    },
  },
  vent: {
    id: 'vent',
    family: 'renouvelable',
    name: 'Vent',
    converterShort: 'Éoliennes',
    emissionLabel: 'Peu émettrice de gaz à effet de serre',
    conversionFormula: 'Énergie cinétique → Énergie électrique',
    stages: {
      ressource: {
        label: 'Ressource',
        title: 'Vent (mouvement de l’air)',
        text: 'Le vent est un déplacement des gaz de l’atmosphère provoqué par le Soleil. Cette ressource est disponible facilement, mais elle varie selon les jours et les régions.',
        x: 315,
        y: 82,
      },
      extraction: {
        label: 'Captage',
        title: 'Pales face au vent',
        text: 'Placées en hauteur là où le vent souffle régulièrement (sur terre ou en mer), les grandes pales captent le mouvement de l’air et se mettent à tourner.',
        x: 378,
        y: 112,
      },
      convertisseur: {
        label: 'Convertisseur',
        title: 'Éoliennes',
        text: 'Les éoliennes utilisent l’énergie cinétique (de mouvement) du vent pour faire tourner un générateur et produire de l’énergie électrique.',
        x: 378,
        y: 178,
      },
      transport: {
        label: 'Transport',
        title: 'Transport d’électricité',
        text: 'Un câble souterrain relie l’éolienne à un poste électrique, puis les lignes à haute tension distribuent le courant vers les habitations.',
        x: 705,
        y: 162,
      },
    },
  },
  eau: {
    id: 'eau',
    family: 'renouvelable',
    name: 'Eau',
    converterShort: 'Barrage',
    emissionLabel: 'Peu émettrice de gaz à effet de serre',
    conversionFormula: 'Énergie de pesanteur → Énergie électrique',
    stages: {
      ressource: {
        label: 'Ressource',
        title: 'Eau (cycle naturel)',
        text: 'Grâce au Soleil qui évapore l’eau des mers, la pluie et la fonte des neiges alimentent les rivières en montagne de manière renouvelable.',
        x: 495,
        y: 120,
      },
      extraction: {
        label: 'Stockage',
        title: 'Lac de retenue',
        text: 'L’eau est stockée dans un lac derrière un mur (plus de 52 000 grands barrages dans le monde). En cas de fort besoin d’électricité, l’eau stockée en hauteur peut être libérée rapidement.',
        x: 525,
        y: 166,
      },
      convertisseur: {
        label: 'Convertisseur',
        title: 'Barrage hydroélectrique',
        text: 'Le barrage utilise l’énergie de pesanteur de l’eau qui chute pour faire tourner une turbine et produire de l’énergie électrique.',
        x: 565,
        y: 210,
      },
      transport: {
        label: 'Transport',
        title: 'Transport d’électricité',
        text: 'L’électricité part du barrage sur les lignes à haute tension jusqu’aux villes et aux quartiers.',
        x: 705,
        y: 162,
      },
    },
  },
  terre: {
    id: 'terre',
    family: 'renouvelable',
    name: 'Terre',
    converterShort: 'Centrale géothermique',
    emissionLabel: 'Peu émettrice de gaz à effet de serre',
    conversionFormula: 'Énergie thermique → Énergie électrique / chaleur',
    stages: {
      ressource: {
        label: 'Ressource',
        title: 'Chaleur du sous-sol terrestre',
        text: 'Le sous-sol de la Terre dégage de la chaleur en permanence et partout, grâce à la radioactivité naturelle des roches (environ 0,03 % de l’énergie reçue du Soleil).',
        x: 245,
        y: 308,
      },
      extraction: {
        label: 'Extraction',
        title: 'Extraction de chaleur',
        text: 'On pompe de l’eau chaude ou de la vapeur en profondeur, ou on injecte de l’eau froide qui se réchauffe au contact des roches chaudes (comme Massileo le fait avec l’eau de mer en surface !).',
        x: 332,
        y: 274,
      },
      convertisseur: {
        label: 'Convertisseur',
        title: 'Centrale géothermique',
        text: 'La centrale géothermique utilise la vapeur chaude du sous-sol pour faire tourner une turbine et produire de l’électricité ou alimenter un réseau de chauffage.',
        x: 382,
        y: 230,
      },
      transport: {
        label: 'Transport',
        title: 'Réseau électrique ou réseau de chaleur',
        text: 'L’électricité rejoint les lignes du réseau national, tandis que l’eau chaude circule dans des tuyaux isolés vers les logements voisins.',
        x: 705,
        y: 162,
      },
    },
  },
  vegetaux: {
    id: 'vegetaux',
    family: 'renouvelable',
    name: 'Végétaux',
    converterShort: 'Centrale à biomasse',
    emissionLabel: 'Faible bilan carbone si les forêts sont gérées',
    conversionFormula: 'Énergie chimique (biomasse) → Énergie thermique → Énergie électrique',
    stages: {
      ressource: {
        label: 'Ressource',
        title: 'Végétaux (bois et matière organique)',
        text: 'Les végétaux poussent grâce au Soleil, à l’eau et aux sels minéraux. Le bois et les déchets végétaux forment la biomasse, renouvelable si l’on replante autant que l’on coupe.',
        x: 112,
        y: 192,
      },
      extraction: {
        label: 'Stockage',
        title: 'Récolte et stockage',
        text: 'Les résidus de bois, de paille ou de déchets organiques sont collectés, séchés et stockés avant d’être utilisés dans une chaudière ou un méthaniseur.',
        x: 158,
        y: 228,
      },
      convertisseur: {
        label: 'Convertisseur',
        title: 'Centrale à biomasse',
        text: 'La centrale à biomasse brûle les végétaux (ou le gaz issu de leur décomposition) pour chauffer de l’eau, produire de la vapeur et générer de l’électricité ou du chauffage.',
        x: 222,
        y: 238,
      },
      transport: {
        label: 'Transport',
        title: 'Transport d’électricité',
        text: 'L’énergie électrique produite est envoyée sur le réseau de distribution jusqu’aux bâtiments.',
        x: 705,
        y: 162,
      },
    },
  },
  petrole: {
    id: 'petrole',
    family: 'non-renouvelable',
    name: 'Pétrole',
    converterShort: 'Moteur thermique / centrale',
    emissionLabel: 'Forte émettrice de gaz à effet de serre',
    conversionFormula: 'Énergie chimique → Énergie thermique → Énergie cinétique / électrique',
    stages: {
      ressource: {
        label: 'Ressource',
        title: 'Pétrole (1re source énergétique mondiale)',
        text: 'Le pétrole est un liquide huileux formé très lentement dans le sous-sol pendant des millions d’années à partir d’anciens végétaux et animaux. Il ne se renouvelle pas à l’échelle humaine.',
        x: 116,
        y: 306,
      },
      extraction: {
        label: 'Extraction',
        title: 'Derrick (sur terre ou en mer)',
        text: 'Le derrick est une tour qui soutient le forage des puits de pétrole. Environ 4 500 millions de tonnes de pétrole sont extraites chaque année dans le monde, puis stockées en citerne.',
        x: 120,
        y: 186,
      },
      convertisseur: {
        label: 'Convertisseur',
        title: 'Moteur thermique (après raffinage)',
        text: 'Après raffinage en essence ou gazole, le moteur thermique brûle le carburant pour transformer l’énergie thermique en énergie cinétique et déplacer les véhicules.',
        x: 248,
        y: 215,
      },
      transport: {
        label: 'Transport',
        title: 'Distribution de carburant ou d’électricité',
        text: 'Le pétrole raffiné est acheminé par oléoducs ou camions-citernes jusqu’aux stations-service et aux centrales.',
        x: 705,
        y: 162,
      },
    },
  },
  charbon: {
    id: 'charbon',
    family: 'non-renouvelable',
    name: 'Charbon',
    converterShort: 'Centrale thermique à charbon',
    emissionLabel: 'Très forte émettrice de gaz à effet de serre',
    conversionFormula: 'Énergie thermique (combustion) → Énergie électrique',
    stages: {
      ressource: {
        label: 'Ressource',
        title: 'Charbon (2e source énergétique mondiale)',
        text: 'Le charbon est une roche sédimentaire noire formée très lentement par la décomposition d’anciens végétaux enfouis. Ses réserves s’épuisent lorsqu’on les consomme.',
        x: 280,
        y: 308,
      },
      extraction: {
        label: 'Extraction',
        title: 'Mine à ciel ouvert ou souterraine',
        text: 'Environ 8 milliards de tonnes de charbon sont extraites chaque année dans des mines sous terre ou en plein air, puis stockées à ciel ouvert.',
        x: 332,
        y: 256,
      },
      convertisseur: {
        label: 'Convertisseur',
        title: 'Centrale thermique à charbon',
        text: 'La centrale thermique brûle le charbon pour chauffer de l’eau, créer de la vapeur sous pression et produire de l’énergie électrique (en émettant beaucoup de CO₂).',
        x: 410,
        y: 200,
      },
      transport: {
        label: 'Transport',
        title: 'Transport d’électricité',
        text: 'L’électricité quitte la centrale par des pylônes à haute tension vers les villes et les industries.',
        x: 705,
        y: 162,
      },
    },
  },
  gaz: {
    id: 'gaz',
    family: 'non-renouvelable',
    name: 'Gaz naturel',
    converterShort: 'Centrale à gaz / chaudière',
    emissionLabel: 'Forte émettrice de gaz à effet de serre',
    conversionFormula: 'Énergie thermique (combustion) → Énergie électrique / chaleur',
    stages: {
      ressource: {
        label: 'Ressource',
        title: 'Gaz naturel (3e source énergétique mondiale)',
        text: 'Le gaz naturel est un mélange de gaz enfoui dans le sous-sol, formé lui aussi sur des millions d’années par la décomposition d’organismes anciens.',
        x: 446,
        y: 310,
      },
      extraction: {
        label: 'Stockage',
        title: 'Forage et stockage en citerne ou sous terre',
        text: 'Extrait du sous-sol par forage, le gaz naturel est stocké dans des citernes ou des cavités souterraines (environ 7 000 milliards de m³ stockés dans le monde).',
        x: 486,
        y: 234,
      },
      convertisseur: {
        label: 'Convertisseur',
        title: 'Centrale thermique à gaz',
        text: 'La combustion du gaz naturel dégage de l’énergie thermique qui fait tourner une turbine ou chauffe directement l’eau des bâtiments.',
        x: 540,
        y: 204,
      },
      transport: {
        label: 'Transport',
        title: 'Gazoducs et réseau électrique',
        text: 'Le gaz voyage dans des tuyaux souterrains (gazoducs), ou l’électricité produite circule sur les lignes électriques.',
        x: 705,
        y: 162,
      },
    },
  },
  uranium: {
    id: 'uranium',
    family: 'non-renouvelable',
    name: 'Uranium',
    converterShort: 'Centrale nucléaire',
    emissionLabel: 'Peu de gaz à effet de serre (déchets radioactifs)',
    conversionFormula: 'Énergie nucléaire → Énergie thermique → Énergie électrique',
    stages: {
      ressource: {
        label: 'Ressource',
        title: 'Uranium (5e source énergétique mondiale)',
        text: 'L’uranium est un métal présent dans certains minerais du sous-sol terrestre. Comme il existe en quantité limitée sur Terre, c’est une ressource non renouvelable.',
        x: 584,
        y: 308,
      },
      extraction: {
        label: 'Extraction',
        title: 'Mine de minerai et stockage en fût',
        text: 'Le minerai d’uranium est extrait dans des mines à ciel ouvert ou souterraines, puis enrichi et transporté en fûts sécurisés.',
        x: 602,
        y: 248,
      },
      convertisseur: {
        label: 'Convertisseur',
        title: 'Centrale nucléaire',
        text: 'La centrale nucléaire utilise la fission des atomes d’uranium pour transformer l’énergie nucléaire en chaleur, puis en énergie électrique grâce à la vapeur.',
        x: 626,
        y: 186,
      },
      transport: {
        label: 'Transport',
        title: 'Transport d’électricité',
        text: 'L’électricité produite alimente le réseau national à haute tension. Sur 106 000 km de lignes en France, seules 6 % sont enterrées.',
        x: 705,
        y: 162,
      },
    },
  },
};

const RENEWABLE_IDS: RenewableSourceId[] = ['soleil', 'vent', 'eau', 'terre', 'vegetaux'];
const NON_RENEWABLE_IDS: NonRenewableSourceId[] = ['petrole', 'charbon', 'gaz', 'uranium'];
const STAGE_ORDER: StageId[] = ['ressource', 'extraction', 'convertisseur', 'transport'];

export default function EnergySourcesExplorer() {
  const [family, setFamily] = useState<EnergyFamily>('renouvelable');
  const [sourceId, setSourceId] = useState<SourceId>('soleil');
  const [stageId, setStageId] = useState<StageId>('ressource');

  const sourceList = family === 'renouvelable' ? RENEWABLE_IDS : NON_RENEWABLE_IDS;
  const activeSource = SOURCES[sourceId];
  const activeStage = activeSource.stages[stageId];

  const handleFamilyChange = (nextFamily: EnergyFamily) => {
    setFamily(nextFamily);
    setSourceId(nextFamily === 'renouvelable' ? 'soleil' : 'petrole');
    setStageId('ressource');
  };

  const handleSelectSource = (id: SourceId, defaultStage: StageId = 'ressource') => {
    setSourceId(id);
    setStageId(defaultStage);
  };

  const hotspotProps = (id: StageId, label: string) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `Zone ${label}`,
    'aria-pressed': stageId === id,
    onClick: () => setStageId(id),
    onKeyDown: (e: KeyboardEvent<SVGGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setStageId(id);
      }
    },
    className: 'cursor-pointer outline-none',
  });

  const s1 = activeSource.stages.ressource;
  const s2 = activeSource.stages.extraction;
  const s3 = activeSource.stages.convertisseur;
  const s4 = activeSource.stages.transport;

  const flowPath = `M${s1.x},${s1.y} L${s2.x},${s2.y} L${s3.x},${s3.y} L${s4.x},${s4.y}`;

  return (
    <section
      className="mt-8 sm:mt-10"
      aria-labelledby="sources-energie-title"
    >
      <header className="mb-4 sm:mb-5">
        <h2
          id="sources-energie-title"
          className="font-display text-xl font-bold tracking-tight text-[var(--ink)] sm:text-[1.5rem] [text-wrap:balance]"
        >
          Les sources d’énergie : renouvelables et non renouvelables
        </h2>
        <p className="mt-1 text-[0.95rem] text-[var(--mute)]">
          Choisis une famille, puis clique sur les zones numérotées du paysage pour suivre la chaîne énergétique.
        </p>
      </header>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-6">
        {/* 1. Family segmented toggle + Source tabs */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="inline-flex rounded-xl border border-[var(--line)] bg-[var(--bg)] p-1"
            role="group"
            aria-label="Famille de ressources énergétiques"
          >
            <button
              type="button"
              onClick={() => handleFamilyChange('renouvelable')}
              aria-pressed={family === 'renouvelable'}
              className={`min-h-[42px] cursor-pointer whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[0.9rem] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                family === 'renouvelable'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--ink)] hover:text-[var(--accent)]'
              }`}
            >
              Énergies renouvelables
            </button>
            <button
              type="button"
              onClick={() => handleFamilyChange('non-renouvelable')}
              aria-pressed={family === 'non-renouvelable'}
              className={`min-h-[42px] cursor-pointer whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[0.9rem] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                family === 'non-renouvelable'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--ink)] hover:text-[var(--accent)]'
              }`}
            >
              Énergies non renouvelables
            </button>
          </div>

          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Sélection de la source d’énergie"
          >
            {sourceList.map((id) => {
              const item = SOURCES[id];
              const isSelected = sourceId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelectSource(id)}
                  aria-pressed={isSelected}
                  className={`min-h-[42px] cursor-pointer whitespace-nowrap rounded-lg border px-3 py-1.5 text-[0.88rem] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)] font-semibold'
                      : 'border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] hover:border-[var(--accent)] hover:text-[var(--ink)]'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Interactive illustrated landscape SVG */}
        <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] p-2 sm:p-3">
          <svg
            viewBox="0 0 840 350"
            className="block h-auto w-full select-none"
            role="img"
            aria-label={`Paysage interactif des ${
              family === 'renouvelable' ? 'énergies renouvelables' : 'énergies non renouvelables'
            }, source sélectionnée : ${activeSource.name}`}
          >
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--sky-top)" />
                <stop offset="100%" stopColor="var(--sky-bot)" />
              </linearGradient>
            </defs>

            {/* Sky, Surface Ground, and Subsoil Cutaway */}
            <rect x="0" y="0" width="840" height="238" fill="url(#skyGrad)" />
            <path
              d="M0,226 Q180,210 380,224 T640,218 L840,224 L840,262 L0,262 Z"
              fill="var(--ground)"
            />
            <rect x="0" y="254" width="840" height="96" fill="var(--subsoil)" />
            <rect x="0" y="294" width="840" height="56" fill="var(--subsoil-deep)" opacity="0.65" />
            <line x1="0" y1="254" x2="840" y2="254" stroke="var(--ground-dark)" strokeWidth="3" />

            {/* ================= SCENE A : RENOUVELABLES ================= */}
            {family === 'renouvelable' && (
              <g>
                {/* Distant hills / mountain for hydro */}
                <path
                  d="M420,224 L510,96 L605,222 Z"
                  fill="var(--ground-dark)"
                  opacity="0.7"
                />
                <path
                  d="M485,132 L510,96 L534,132 Z"
                  fill="#ffffff"
                  opacity="0.65"
                />

                {/* SOLEIL + PANNEAUX PHOTOVOLTAÏQUES */}
                <g
                  onClick={() => handleSelectSource('soleil', 'ressource')}
                  className="cursor-pointer"
                  opacity={sourceId === 'soleil' ? 1 : 0.72}
                >
                  <circle cx="92" cy="62" r="28" fill="#f59e0b" />
                  <circle cx="92" cy="62" r="37" fill="#fbbf24" opacity="0.25" />
                  {/* Rays */}
                  <line x1="126" y1="88" x2="215" y2="165" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.85" />
                  <line x1="112" y1="98" x2="202" y2="178" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 5" opacity="0.7" />
                </g>

                <g
                  onClick={() => handleSelectSource('soleil', 'convertisseur')}
                  className="cursor-pointer"
                  opacity={sourceId === 'soleil' ? 1 : 0.78}
                >
                  {/* Solar panel stand + tilted panel */}
                  <line x1="245" y1="204" x2="245" y2="226" stroke="var(--grid-line)" strokeWidth="4" />
                  <polygon
                    points="206,204 268,180 284,198 222,222"
                    fill="#1d4ed8"
                    stroke="#93c5fd"
                    strokeWidth="2"
                  />
                  <line x1="226" y1="196" x2="242" y2="214" stroke="#93c5fd" strokeWidth="1" opacity="0.75" />
                  <line x1="247" y1="188" x2="263" y2="206" stroke="#93c5fd" strokeWidth="1" opacity="0.75" />
                  <text x="245" y="242" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="600">
                    Panneaux solaires
                  </text>
                </g>

                {/* VÉGÉTAUX + CENTRALE BIOMASSE */}
                <g
                  onClick={() => handleSelectSource('vegetaux', 'ressource')}
                  className="cursor-pointer"
                  opacity={sourceId === 'vegetaux' ? 1 : 0.78}
                >
                  {/* Trees */}
                  <rect x="86" y="205" width="7" height="24" fill="#7c4a2d" />
                  <circle cx="89.5" cy="195" r="16" fill="#4d7c0f" />
                  <rect x="116" y="202" width="8" height="27" fill="#7c4a2d" />
                  <circle cx="120" cy="190" r="19" fill="#65a30d" />
                  {/* Biomass plant */}
                  <rect x="148" y="216" width="38" height="24" rx="4" fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" />
                  <rect x="174" y="198" width="7" height="18" fill="var(--grid-line)" />
                  <circle className="steam-plume" cx="177.5" cy="190" r="5" fill="#cbd5e1" />
                  <text x="128" y="250" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="600">
                    Biomasse
                  </text>
                </g>

                {/* VENT + ÉOLIENNES */}
                <g
                  onClick={() => handleSelectSource('vent', 'convertisseur')}
                  className="cursor-pointer"
                  opacity={sourceId === 'vent' ? 1 : 0.78}
                >
                  {/* Wind streaks */}
                  <path d="M262,74 Q295,66 328,74" fill="none" stroke="var(--sea-wave)" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M276,92 Q308,85 338,92" fill="none" stroke="var(--sea-wave)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                  {/* Wind turbine tower */}
                  <line x1="378" y1="112" x2="378" y2="226" stroke="var(--grid-line)" strokeWidth="4.5" strokeLinecap="round" />
                  {/* Rotating blades */}
                  <g className="turbine-rotor">
                    <circle cx="378" cy="112" r="4.5" fill="var(--ink)" />
                    <path d="M378,112 L374,70 L382,70 Z" fill="var(--card)" stroke="var(--grid-line)" strokeWidth="1.2" />
                    <path d="M378,112 L414,132 L410,139 Z" fill="var(--card)" stroke="var(--grid-line)" strokeWidth="1.2" />
                    <path d="M378,112 L342,132 L346,139 Z" fill="var(--card)" stroke="var(--grid-line)" strokeWidth="1.2" />
                  </g>
                  <text x="378" y="242" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="600">
                    Éoliennes
                  </text>
                </g>

                {/* TERRE + CENTRALE GÉOTHERMIQUE (Subsoil) */}
                <g
                  onClick={() => handleSelectSource('terre', 'ressource')}
                  className="cursor-pointer"
                  opacity={sourceId === 'terre' ? 1 : 0.78}
                >
                  {/* Warm underground pocket */}
                  <ellipse cx="268" cy="312" rx="68" ry="22" fill="#ea580c" opacity="0.28" />
                  <ellipse cx="268" cy="312" rx="44" ry="13" fill="#f97316" opacity="0.45" />
                  {/* Geothermal pipes */}
                  <line x1="312" y1="242" x2="312" y2="306" stroke="var(--sea-wave)" strokeWidth="3.5" />
                  <line x1="336" y1="242" x2="336" y2="306" stroke="var(--accent)" strokeWidth="3.5" />
                  {/* Geothermal station */}
                  <rect x="352" y="218" width="54" height="30" rx="4" fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" />
                  <path className="steam-plume" d="M370,214 q4,-8 0,-16 M384,214 q4,-8 0,-16" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                  <text x="320" y="338" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="600">
                    Chaleur du sous-sol (Géothermie)
                  </text>
                </g>

                {/* EAU + BARRAGE */}
                <g
                  onClick={() => handleSelectSource('eau', 'convertisseur')}
                  className="cursor-pointer"
                  opacity={sourceId === 'eau' ? 1 : 0.78}
                >
                  {/* Reservoir lake */}
                  <path d="M454,168 L548,168 L540,196 L466,196 Z" fill="#38bdf8" opacity="0.75" />
                  {/* Concrete dam wall */}
                  <polygon points="544,158 564,158 574,226 540,226" fill="#94a3b8" stroke="var(--grid-line)" strokeWidth="1.5" />
                  {/* Outflow waterfall */}
                  <path d="M565,192 Q582,202 586,226" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                  <text x="540" y="242" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="600">
                    Barrage
                  </text>
                </g>
              </g>
            )}

            {/* ================= SCENE B : NON RENOUVELABLES ================= */}
            {family === 'non-renouvelable' && (
              <g>
                {/* PÉTROLE + DERRICK + MOTEUR */}
                <g
                  onClick={() => handleSelectSource('petrole', 'ressource')}
                  className="cursor-pointer"
                  opacity={sourceId === 'petrole' ? 1 : 0.78}
                >
                  {/* Underground oil pocket */}
                  <ellipse cx="118" cy="310" rx="58" ry="18" fill="#1e293b" opacity="0.82" />
                  <line x1="118" y1="226" x2="118" y2="306" stroke="#334155" strokeWidth="4" />
                  {/* Derrick tower */}
                  <polygon points="104,226 118,164 132,226" fill="none" stroke="var(--grid-line)" strokeWidth="2.5" />
                  <line x1="108" y1="202" x2="128" y2="202" stroke="var(--grid-line)" strokeWidth="2" />
                  <line x1="112" y1="184" x2="124" y2="184" stroke="var(--grid-line)" strokeWidth="2" />
                  {/* Vehicle / thermal engine icon */}
                  <rect x="218" y="206" width="54" height="22" rx="6" fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" />
                  <circle cx="230" cy="228" r="6" fill="var(--grid-line)" />
                  <circle cx="260" cy="228" r="6" fill="var(--grid-line)" />
                  <text x="118" y="340" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="600">
                    Pétrole
                  </text>
                </g>

                {/* CHARBON + MINE + CENTRALE THERMIQUE */}
                <g
                  onClick={() => handleSelectSource('charbon', 'ressource')}
                  className="cursor-pointer"
                  opacity={sourceId === 'charbon' ? 1 : 0.78}
                >
                  {/* Coal seam */}
                  <path d="M236,304 Q282,292 326,308 L318,324 L240,322 Z" fill="#0f172a" opacity="0.85" />
                  {/* Open pit steps */}
                  <polygon points="310,226 356,226 344,256 320,256" fill="#64748b" opacity="0.55" />
                  {/* Coal thermal plant */}
                  <rect x="378" y="196" width="58" height="32" rx="3" fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" />
                  <rect x="386" y="164" width="10" height="32" fill="var(--grid-line)" />
                  <rect x="404" y="172" width="10" height="24" fill="var(--grid-line)" />
                  <circle className="steam-plume" cx="391" cy="154" r="7" fill="#94a3b8" />
                  <text x="342" y="340" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="600">
                    Charbon
                  </text>
                </g>

                {/* GAZ NATUREL + CITERNE */}
                <g
                  onClick={() => handleSelectSource('gaz', 'ressource')}
                  className="cursor-pointer"
                  opacity={sourceId === 'gaz' ? 1 : 0.78}
                >
                  {/* Underground gas pocket */}
                  <ellipse cx="446" cy="312" rx="46" ry="16" fill="#64748b" opacity="0.55" />
                  <line x1="446" y1="226" x2="446" y2="306" stroke="var(--grid-line)" strokeWidth="3" strokeDasharray="4 3" />
                  {/* Gas spherical/cylindrical tank */}
                  <circle cx="486" cy="212" r="16" fill="var(--card)" stroke="var(--grid-line)" strokeWidth="2" />
                  {/* Gas plant */}
                  <rect x="518" y="198" width="44" height="30" rx="3" fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" />
                  <text x="488" y="340" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="600">
                    Gaz naturel
                  </text>
                </g>

                {/* URANIUM + CENTRALE NUCLÉAIRE */}
                <g
                  onClick={() => handleSelectSource('uranium', 'convertisseur')}
                  className="cursor-pointer"
                  opacity={sourceId === 'uranium' ? 1 : 0.78}
                >
                  {/* Uranium ore */}
                  <polygon points="564,316 584,296 606,314 592,326" fill="#4d7c0f" opacity="0.8" />
                  <line x1="590" y1="226" x2="590" y2="302" stroke="var(--grid-line)" strokeWidth="3" />
                  {/* Nuclear cooling tower + dome */}
                  <path
                    d="M610,228 Q618,196 614,174 L640,174 Q636,196 644,228 Z"
                    fill="var(--card)"
                    stroke="var(--grid-line)"
                    strokeWidth="1.75"
                  />
                  <path d="M648,228 L648,204 A12,12 0 0,1 672,204 L672,228 Z" fill="var(--card)" stroke="var(--grid-line)" strokeWidth="1.5" />
                  <circle className="steam-plume" cx="627" cy="160" r="9" fill="#cbd5e1" />
                  <circle className="steam-plume" cx="634" cy="148" r="6" fill="#cbd5e1" />
                  <text x="626" y="340" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="600">
                    Uranium
                  </text>
                </g>
              </g>
            )}

            {/* ================= TRANSPORT & DISTRIBUTION (SHARED RIGHT ZONE) ================= */}
            <g
              onClick={() => setStageId('transport')}
              className="cursor-pointer"
            >
              {/* High-voltage pylon */}
              <path
                d="M694,226 L705,150 L716,226 M690,170 L720,170 M696,192 L714,192"
                fill="none"
                stroke="var(--grid-line)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Power lines to buildings */}
              <path
                d="M720,170 Q750,185 776,182"
                fill="none"
                stroke="var(--grid-line)"
                strokeWidth="1.75"
              />
              {/* Town buildings */}
              <rect x="768" y="176" width="26" height="50" rx="2" fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" />
              <rect x="798" y="190" width="26" height="36" rx="2" fill="var(--card)" stroke="var(--line)" strokeWidth="1.5" />
              <rect x="774" y="184" width="5" height="6" fill="#fbbf24" opacity="0.85" />
              <rect x="783" y="184" width="5" height="6" fill="#fbbf24" opacity="0.85" />
              <rect x="774" y="196" width="5" height="6" fill="#fbbf24" opacity="0.85" />
              <rect x="804" y="198" width="5" height="6" fill="#fbbf24" opacity="0.85" />
              <text x="760" y="244" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="600">
                Transport & Réseau
              </text>
            </g>

            {/* ================= ANIMATED ENERGY CHAIN PATH & HOTSPOTS ================= */}
            <path
              d={flowPath}
              fill="none"
              stroke="var(--card)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
            <path
              d={flowPath}
              className="massileo-flow"
              strokeLinejoin="round"
            />

            {STAGE_ORDER.map((st, idx) => {
              const point = activeSource.stages[st];
              const isCurrent = stageId === st;
              return (
                <g key={st} {...hotspotProps(st, point.label)}>
                  {/* Touch target >= 32px in SVG units */}
                  <circle cx={point.x} cy={point.y} r="20" fill="transparent" />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isCurrent ? 15 : 12.5}
                    fill={isCurrent ? 'var(--accent)' : 'var(--card)'}
                    stroke="var(--accent)"
                    strokeWidth={isCurrent ? '2.5' : '2'}
                  />
                  <text
                    x={point.x}
                    y={point.y + 4.5}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill={isCurrent ? '#ffffff' : 'var(--ink)'}
                    style={{fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'}}
                  >
                    {idx + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 3. Interactive Stage Selector & Detailed Explanation Card */}
        <div className="mt-4">
          {/* 4-Step Energy Chain Buttons */}
          <div
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            role="tablist"
            aria-label="Étapes de la chaîne énergétique"
          >
            {STAGE_ORDER.map((st, idx) => {
              const stageData = activeSource.stages[st];
              const isCurrent = stageId === st;
              return (
                <button
                  key={st}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  onClick={() => setStageId(st)}
                  className={`min-h-[44px] cursor-pointer rounded-lg border px-3 py-2 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    isCurrent
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                      : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)]'
                  }`}
                >
                  <span className="block text-[0.75rem] opacity-85 tabular-nums">
                    Étape {idx + 1}
                  </span>
                  <span className="block truncate text-[0.9rem] font-semibold">
                    {stageData.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Explanation */}
          <div
            role="tabpanel"
            aria-live="polite"
            className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] p-4"
          >
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.84rem] font-medium text-[var(--mute)]">
              <span className="font-semibold text-[var(--accent)]">
                {activeSource.family === 'renouvelable' ? 'Renouvelable' : 'Non renouvelable'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{activeSource.emissionLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[var(--ink)]">{activeSource.conversionFormula}</span>
            </div>

            <h3 className="font-display mt-2 text-[1.05rem] font-bold text-[var(--ink)]">
              {activeStage.title}
            </h3>
            <p className="mt-1 mb-0 text-[0.97rem] leading-relaxed text-[var(--ink)] tabular-nums">
              {activeStage.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
