import {type KeyboardEvent, type MouseEvent, useState} from 'react';
import EnergySourcesExplorer from './components/EnergySourcesExplorer';
import WaterLifecycleCarousel from './components/WaterLifecycleCarousel';

type ModeKey = 'hiver' | 'ete' | 'echange';
type ComponentKey = 'mer' | 'echangeur' | 'pac-bureaux' | 'pac-logements';
type FactKey = 'renewable' | 'emissions';

interface ModeConfig {
  id: ModeKey;
  label: string;
  /** [seaToExchanger, bureauxBranch, logementsBranch]: 1 = normal, -1 = reverse, 0 = attenuated */
  flows: [number, number, number];
  explanation: string;
  seaBadge: string;
  bureauxAction: string;
  logementsAction: string;
}

interface ComponentDefinition {
  title: string;
  subtitle: string;
  description: string;
  /** Positioning near the 'i' badge inside the relative SVG container */
  tooltipClass: string;
  caretClass: string;
}

const COMPONENT_DEFINITIONS: Record<ComponentKey, ComponentDefinition> = {
  mer: {
    title: 'Mer Méditerranée',
    subtitle: 'Source thermique naturelle',
    description:
      'La mer garde une température presque stable toute l’année (entre 13 °C et 25 °C). Pompée en profondeur puis rejetée sans jamais être polluée, elle sert de grande réserve de chaleur ou de fraîcheur.',
    tooltipClass: 'left-2 right-2 top-3 sm:left-[26%] sm:right-auto sm:top-[22%] sm:w-[290px]',
    caretClass: 'hidden sm:block sm:-left-1.5 sm:top-[48%]',
  },
  echangeur: {
    title: 'Échangeur thalassothermie',
    subtitle: 'Échangeur à plaques en métal',
    description:
      'Cet appareil transfère la chaleur entre l’eau de mer et l’eau douce de la boucle à travers de fines plaques métalliques. Les deux eaux circulent côte à côte sans jamais se mélanger.',
    tooltipClass: 'left-2 right-2 top-3 sm:left-[44%] sm:right-auto sm:top-auto sm:bottom-[50%] sm:w-[290px] sm:-translate-x-1/2',
    caretClass: 'hidden sm:block sm:left-1/2 sm:-bottom-1.5 sm:-translate-x-1/2',
  },
  'pac-bureaux': {
    title: 'Pompe à chaleur (PAC)',
    subtitle: 'Équipement des bureaux',
    description:
      'Comme un réfrigérateur réversible, la PAC utilise un peu d’électricité pour capter la chaleur de la boucle et chauffer le bâtiment, ou au contraire rejeter la chaleur en trop lors de la climatisation.',
    tooltipClass: 'left-2 right-2 bottom-3 sm:left-auto sm:right-[36%] sm:bottom-[44%] sm:w-[290px]',
    caretClass: 'hidden sm:block sm:-right-1.5 sm:bottom-5',
  },
  'pac-logements': {
    title: 'Pompe à chaleur (PAC)',
    subtitle: 'Équipement des logements',
    description:
      'La PAC des logements élève la température prélevée sur la boucle d’eau tempérée pour chauffer les appartements et produire l’eau chaude sanitaire de façon très économe en énergie.',
    tooltipClass: 'left-2 right-2 bottom-3 sm:left-auto sm:right-[13%] sm:bottom-[44%] sm:w-[290px]',
    caretClass: 'hidden sm:block sm:-right-1.5 sm:bottom-5',
  },
};

const FACT_TOOLTIPS: Record<
  FactKey,
  {label: string; title: string; explanation: string}
> = {
  renewable: {
    label: '75 % de l’énergie fournie est renouvelable',
    title: 'Comment obtient-on ces 75 % ?',
    explanation:
      'Pour fournir 100 % de chaleur ou de fraîcheur aux bâtiments, le système puise environ 75 % d’énergie thermique gratuite dans la mer Méditerranée et n’utilise que 25 % d’électricité pour faire fonctionner les pompes à chaleur.',
  },
  emissions: {
    label: 'La thalassothermie peut réduire de 80 % les émissions de gaz à effet de serre',
    title: 'D’où viennent ces 80 % de CO₂ en moins ?',
    explanation:
      'Ce chiffre compare Massileo à des chaudières classiques au gaz ou au fioul : comme on ne brûle aucun combustible fossile dans le quartier et que l’électricité utilisée en France émet peu de CO₂, on évite jusqu’à 80 % des émissions.',
  },
};

const MODES: Record<ModeKey, ModeConfig> = {
  hiver: {
    id: 'hiver',
    label: 'Besoin de chaleur',
    flows: [1, 1, 1],
    explanation:
      'Besoin de chaleur : l’eau de mer apporte de l’énergie thermique à la boucle. Les pompes à chaleur des bâtiments la récupèrent pour chauffer et produire l’eau chaude.',
    seaBadge: 'Apport d’énergie thermique',
    bureauxAction: 'Chauffage',
    logementsAction: 'Chauffage & eau chaude',
  },
  ete: {
    id: 'ete',
    label: 'Besoin de fraîcheur',
    flows: [-1, -1, -1],
    explanation:
      'Besoin de fraîcheur : les bâtiments se rafraîchissent, la chaleur extraite est évacuée vers la boucle, puis vers la mer.',
    seaBadge: 'Rejet de chaleur vers la mer',
    bureauxAction: 'Climatisation active',
    logementsAction: 'Rafraîchissement',
  },
  echange: {
    id: 'echange',
    label: 'Échange de calories',
    flows: [0, -1, 1],
    explanation:
      'Échange de calories : la chaleur dégagée par la climatisation des bureaux est récupérée pour produire l’eau chaude des logements, et vice-versa.',
    seaBadge: 'Lien avec la mer atténué',
    bureauxAction: 'Climatisation (cède de la chaleur)',
    logementsAction: 'Eau chaude (reçoit la chaleur)',
  },
};

const MODE_ORDER: ModeKey[] = ['hiver', 'ete', 'echange'];

const IMAGES = {
  mer: '/src/assets/images/illu_mer_mediterranee_1795610305725.jpg',
  echangeur: '/src/assets/images/illu_echangeur_thalasso_1795610306489.jpg',
  bureaux: '/src/assets/images/illu_bureaux_fabriques_1795610306320.jpg',
  logements: '/src/assets/images/illu_logements_fabriques_1795610307213.jpg',
};

function ArrowHead({
  x,
  y,
  direction,
  opacity = 1,
}: {
  x: number;
  y: number;
  direction: 'right' | 'left' | 'up' | 'down';
  opacity?: number;
}) {
  const rotation =
    direction === 'right'
      ? 0
      : direction === 'down'
        ? 90
        : direction === 'left'
          ? 180
          : -90;

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotation})`}
      style={{opacity, transition: 'opacity 0.25s ease'}}
      aria-hidden="true"
    >
      <circle r="9" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" />
      <path
        d="M-3,-4 L4,0 L-3,4"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

export default function App() {
  const [mode, setMode] = useState<ModeKey>('hiver');
  const [hoveredComp, setHoveredComp] = useState<ComponentKey | null>(null);
  const [pinnedComp, setPinnedComp] = useState<ComponentKey | null>(null);
  const [hoveredFact, setHoveredFact] = useState<FactKey | null>(null);
  const [pinnedFact, setPinnedFact] = useState<FactKey | null>(null);
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({});
  const active = MODES[mode];
  const activeComp = hoveredComp ?? pinnedComp;
  const activeDef = activeComp ? COMPONENT_DEFINITIONS[activeComp] : null;
  const activeFact = hoveredFact ?? pinnedFact;

  const [fSea, fBureaux, fLogements] = active.flows;

  const markFailed = (key: string) => {
    setImgFailed((prev) => ({...prev, [key]: true}));
  };

  const handleTogglePin = (key: ComponentKey) => {
    setPinnedComp((prev) => (prev === key ? null : key));
  };

  const interactiveProps = (key: ComponentKey, label: string) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `${label} : afficher la définition`,
    'aria-expanded': activeComp === key,
    onMouseEnter: () => setHoveredComp(key),
    onMouseLeave: () => setHoveredComp((prev) => (prev === key ? null : prev)),
    onFocus: () => setHoveredComp(key),
    onBlur: () => setHoveredComp((prev) => (prev === key ? null : prev)),
    onClick: (e: MouseEvent<SVGGElement>) => {
      e.stopPropagation();
      handleTogglePin(key);
    },
    onKeyDown: (e: KeyboardEvent<SVGGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTogglePin(key);
      } else if (e.key === 'Escape') {
        setPinnedComp(null);
        setHoveredComp(null);
      }
    },
    className:
      'cursor-pointer outline-none focus-visible:opacity-95',
  });

  return (
    <main className="mx-auto max-w-[960px] px-4 py-5 sm:px-6 sm:py-8">
      <header className="mb-4 sm:mb-5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-[1.75rem] [text-wrap:balance]">
          Massileo, la boucle d’eau de mer des Fabriques
        </h1>
        <p className="mt-1 text-[0.95rem] text-[var(--mute)]">
          Écoquartier Les Fabriques, Marseille · Choisis un mode pour voir circuler la chaleur.
        </p>
      </header>

      <WaterLifecycleCarousel className="mt-0" />

      <section
        className="mt-8 sm:mt-10 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-6"
        aria-label="Animation pédagogique Massileo"
      >
        {/* Mode selector buttons (touch-friendly >= 44px) */}
        <div
          className="mb-4 flex flex-wrap gap-2"
          role="group"
          aria-label="Modes de fonctionnement"
        >
          {MODE_ORDER.map((key) => {
            const item = MODES[key];
            const isSelected = mode === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                aria-pressed={isSelected}
                className={`min-h-[44px] cursor-pointer whitespace-nowrap rounded-lg border px-4 py-2 text-[0.92rem] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                    : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Animated SVG diagram with illustrations + hover/tap tooltip */}
        <div className="relative overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] p-2 sm:p-3">
          <svg
            viewBox="0 0 840 420"
            className="block h-auto w-full select-none"
            role="img"
            aria-label={`Schéma animé du fonctionnement de Massileo en mode ${active.label}`}
            onClick={() => {
              setPinnedComp(null);
              setHoveredComp(null);
            }}
          >
            <defs>
              {/* Rounded clip paths for clean framed illustrations */}
              <clipPath id="clip-mer">
                <rect x="14" y="180" width="196" height="156" rx="12" />
              </clipPath>
              <clipPath id="clip-echangeur">
                <rect x="254" y="218" width="136" height="106" rx="10" />
              </clipPath>
              <clipPath id="clip-bureaux">
                <rect x="442" y="22" width="166" height="114" rx="10" />
              </clipPath>
              <clipPath id="clip-logements">
                <rect x="642" y="22" width="166" height="114" rx="10" />
              </clipPath>
            </defs>

            {/* ================= 1. MER MÉDITERRANÉE ================= */}
            <g>
              {/* Water zone backdrop */}
              <rect
                x="14"
                y="180"
                width="196"
                height="196"
                rx="12"
                fill="var(--sea)"
                stroke={activeComp === 'mer' ? 'var(--accent)' : 'var(--line)'}
                strokeWidth={activeComp === 'mer' ? '2.5' : '1.5'}
              />

              {/* Fallback vector coastal sea */}
              <g clipPath="url(#clip-mer)">
                <rect x="14" y="180" width="196" height="156" fill="var(--sea)" />
                <path
                  d="M14,265 Q60,248 110,265 T210,265 L210,336 L14,336 Z"
                  fill="var(--sea-wave)"
                  opacity="0.35"
                />
                {!imgFailed.mer && (
                  <image
                    href={IMAGES.mer}
                    x="-4"
                    y="164"
                    width="232"
                    height="188"
                    preserveAspectRatio="xMidYMid slice"
                    onError={() => markFailed('mer')}
                  />
                )}
                {/* Subtle animated water shimmer lines */}
                <path
                  className="massileo-wave"
                  d="M28,308 q18,-7 36,0 t36,0 t36,0 t36,0"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.72"
                />
                <path
                  className="massileo-wave"
                  d="M36,322 q18,-6 36,0 t36,0 t36,0"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.52"
                />
              </g>

              {/* Pastille d'information 'i' interactive (Mer) */}
              <g
                transform="translate(192, 198)"
                {...interactiveProps('mer', 'Mer Méditerranée')}
              >
                <circle r="22" fill="transparent" />
                <circle
                  r="12"
                  fill={activeComp === 'mer' ? 'var(--accent)' : 'var(--card)'}
                  stroke="var(--accent)"
                  strokeWidth={activeComp === 'mer' ? '2.2' : '1.75'}
                />
                <text
                  x="0"
                  y="4.5"
                  textAnchor="middle"
                  fontSize="12.5"
                  fontWeight="700"
                  fill={activeComp === 'mer' ? '#ffffff' : 'var(--ink)'}
                >
                  i
                </text>
              </g>

              <text
                x="112"
                y="355"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="14"
                fontWeight="700"
                style={{fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'}}
              >
                Mer Méditerranée
              </text>
              <text
                x="112"
                y="370"
                textAnchor="middle"
                fill="var(--mute)"
                fontSize="11.5"
                fontWeight="500"
              >
                {active.seaBadge}
              </text>
            </g>

            {/* ================= PIPES (ALLER-RETOUR) ================= */}
            {/* Sea <-> Exchanger pipe */}
            <path className="massileo-pipe-outer" d="M210,282 H250" />
            <path className="massileo-pipe-inner" d="M210,282 H250" />

            {/* Main Tempered Water Loop (Boucle d'eau tempérée) */}
            <path
              className="massileo-pipe-outer"
              d="M394,264 H794 V308 H394"
            />
            <path
              className="massileo-pipe-inner"
              d="M394,264 H794 V308 H394"
            />

            {/* Bureaux PAC vertical connection */}
            <path className="massileo-pipe-outer" d="M525,264 V210" />
            <path className="massileo-pipe-inner" d="M525,264 V210" />

            {/* Logements PAC vertical connection */}
            <path className="massileo-pipe-outer" d="M725,264 V210" />
            <path className="massileo-pipe-inner" d="M725,264 V210" />

            {/* ================= ANIMATED ORANGE HEAT FLOWS ================= */}
            {/* f1: Sea <-> Exchanger */}
            <path
              id="f1"
              className={`massileo-flow ${fSea < 0 ? 'massileo-flow-reverse' : ''}`}
              style={{opacity: fSea === 0 ? 0.14 : 1}}
              d="M206,282 H254"
            />

            {/* Main Loop flow */}
            <path
              className="massileo-flow"
              d="M394,264 H794 V308 H394"
            />

            {/* fb: Loop <-> Bureaux PAC */}
            <path
              id="fb"
              className={`massileo-flow ${fBureaux < 0 ? 'massileo-flow-reverse' : ''}`}
              style={{opacity: fBureaux === 0 ? 0.14 : 1}}
              d="M525,264 V210"
            />

            {/* fl: Loop <-> Logements PAC */}
            <path
              id="fl"
              className={`massileo-flow ${fLogements < 0 ? 'massileo-flow-reverse' : ''}`}
              style={{opacity: fLogements === 0 ? 0.14 : 1}}
              d="M725,264 V210"
            />

            {/* Directional indicator arrowheads for crystal-clear reading */}
            <ArrowHead
              x={230}
              y={282}
              direction={fSea < 0 ? 'left' : 'right'}
              opacity={fSea === 0 ? 0.18 : 1}
            />
            <ArrowHead x={456} y={264} direction="right" />
            <ArrowHead x={625} y={264} direction="right" />
            <ArrowHead x={625} y={308} direction="left" />
            <ArrowHead
              x={525}
              y={236}
              direction={fBureaux < 0 ? 'down' : 'up'}
            />
            <ArrowHead
              x={725}
              y={236}
              direction={fLogements < 0 ? 'down' : 'up'}
            />

            {/* ================= 2. ÉCHANGEUR THALASSOTHERMIE ================= */}
            <g>
              <rect
                x="248"
                y="212"
                width="148"
                height="164"
                rx="14"
                fill="var(--card)"
                stroke={activeComp === 'echangeur' ? 'var(--accent)' : 'var(--line)'}
                strokeWidth={activeComp === 'echangeur' ? '2.5' : '1.75'}
              />
              <g clipPath="url(#clip-echangeur)">
                <rect x="254" y="218" width="136" height="106" fill="var(--surface-subtle)" />
                {/* Technical fallback vector icon */}
                <g opacity="0.7">
                  <rect x="292" y="238" width="60" height="66" rx="4" fill="var(--pipe)" />
                  <line x1="306" y1="244" x2="306" y2="298" stroke="var(--sea-wave)" strokeWidth="3" />
                  <line x1="316" y1="244" x2="316" y2="298" stroke="var(--accent)" strokeWidth="3" />
                  <line x1="326" y1="244" x2="326" y2="298" stroke="var(--sea-wave)" strokeWidth="3" />
                  <line x1="336" y1="244" x2="336" y2="298" stroke="var(--accent)" strokeWidth="3" />
                </g>
                {!imgFailed.echangeur && (
                  <image
                    href={IMAGES.echangeur}
                    x="250"
                    y="216"
                    width="144"
                    height="110"
                    preserveAspectRatio="xMidYMid slice"
                    onError={() => markFailed('echangeur')}
                  />
                )}
              </g>
              {/* Pastille d'information 'i' interactive (Échangeur) */}
              <g
                transform="translate(378, 230)"
                {...interactiveProps('echangeur', 'Échangeur thalassothermie')}
              >
                <circle r="22" fill="transparent" />
                <circle
                  r="12"
                  fill={activeComp === 'echangeur' ? 'var(--accent)' : 'var(--card)'}
                  stroke="var(--accent)"
                  strokeWidth={activeComp === 'echangeur' ? '2.2' : '1.75'}
                />
                <text
                  x="0"
                  y="4.5"
                  textAnchor="middle"
                  fontSize="12.5"
                  fontWeight="700"
                  fill={activeComp === 'echangeur' ? '#ffffff' : 'var(--ink)'}
                >
                  i
                </text>
              </g>
              <text
                x="322"
                y="345"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13.5"
                fontWeight="700"
                style={{fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'}}
              >
                Échangeur
              </text>
              <text
                x="322"
                y="363"
                textAnchor="middle"
                fill="var(--mute)"
                fontSize="12.5"
                fontWeight="500"
              >
                thalassothermie
              </text>
            </g>

            {/* ================= 3. BUREAUX (CLIMATISATION) + PAC ================= */}
            <g>
              <rect
                x="436"
                y="16"
                width="178"
                height="156"
                rx="14"
                fill="var(--card)"
                stroke="var(--line)"
                strokeWidth="1.75"
              />
              <g clipPath="url(#clip-bureaux)">
                <rect x="442" y="22" width="166" height="114" fill="var(--surface-subtle)" />
                {!imgFailed.bureaux && (
                  <image
                    href={IMAGES.bureaux}
                    x="426"
                    y="12"
                    width="198"
                    height="134"
                    preserveAspectRatio="xMidYMid slice"
                    onError={() => markFailed('bureaux')}
                  />
                )}
              </g>
              <text
                x="525"
                y="151"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13.5"
                fontWeight="700"
                style={{fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'}}
              >
                Bureaux (climatisation)
              </text>
              <text
                x="525"
                y="165"
                textAnchor="middle"
                fill="var(--mute)"
                fontSize="11"
                fontWeight="500"
              >
                {active.bureauxAction}
              </text>

              {/* Connector between PAC and Bureaux */}
              <line
                x1="525"
                y1="172"
                x2="525"
                y2="180"
                stroke="var(--pipe)"
                strokeWidth="6"
              />
              <line
                x1="525"
                y1="172"
                x2="525"
                y2="180"
                stroke="var(--accent)"
                strokeWidth="2.5"
              />

              {/* PAC Bureaux + Pastille 'i' */}
              <g>
                {/* Concentric pulse rings when PAC is active */}
                {fBureaux !== 0 && (
                  <g aria-hidden="true" style={{pointerEvents: 'none'}}>
                    <rect
                      x="480"
                      y="178"
                      width="90"
                      height="36"
                      rx="10"
                      fill="none"
                      stroke={fBureaux > 0 ? 'var(--accent)' : 'var(--sea-wave)'}
                      strokeWidth="2"
                      className="pac-pulse-ring"
                    />
                    <rect
                      x="480"
                      y="178"
                      width="90"
                      height="36"
                      rx="10"
                      fill="none"
                      stroke={fBureaux > 0 ? 'var(--accent)' : 'var(--sea-wave)'}
                      strokeWidth="1.5"
                      className="pac-pulse-ring pac-pulse-ring-delay"
                    />
                  </g>
                )}
                <rect
                  x="482"
                  y="180"
                  width="86"
                  height="32"
                  rx="8"
                  fill={activeComp === 'pac-bureaux' ? 'var(--accent)' : 'var(--card)'}
                  stroke={fBureaux < 0 ? 'var(--sea-wave)' : 'var(--accent)'}
                  strokeWidth={activeComp === 'pac-bureaux' ? '2.25' : '1.75'}
                />
                <text
                  x="516"
                  y="201"
                  textAnchor="middle"
                  fill={activeComp === 'pac-bureaux' ? '#ffffff' : 'var(--ink)'}
                  fontSize="13"
                  fontWeight="700"
                  style={{fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'}}
                >
                  PAC
                </text>
                <g
                  transform="translate(552, 196)"
                  {...interactiveProps('pac-bureaux', 'Pompe à chaleur des bureaux')}
                >
                  <circle r="22" fill="transparent" />
                  <circle
                    r="9.5"
                    fill={activeComp === 'pac-bureaux' ? 'rgba(255,255,255,0.22)' : 'var(--surface-subtle)'}
                    stroke={activeComp === 'pac-bureaux' ? '#ffffff' : 'var(--accent)'}
                    strokeWidth="1.4"
                  />
                  <text
                    x="0"
                    y="3.8"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={activeComp === 'pac-bureaux' ? '#ffffff' : 'var(--ink)'}
                  >
                    i
                  </text>
                </g>
              </g>
            </g>

            {/* ================= 4. LOGEMENTS (EAU CHAUDE) + PAC ================= */}
            <g>
              <rect
                x="636"
                y="16"
                width="178"
                height="156"
                rx="14"
                fill="var(--card)"
                stroke="var(--line)"
                strokeWidth="1.75"
              />
              <g clipPath="url(#clip-logements)">
                <rect x="642" y="22" width="166" height="114" fill="var(--surface-subtle)" />
                {!imgFailed.logements && (
                  <image
                    href={IMAGES.logements}
                    x="622"
                    y="10"
                    width="206"
                    height="138"
                    preserveAspectRatio="xMidYMid slice"
                    onError={() => markFailed('logements')}
                  />
                )}
              </g>
              <text
                x="725"
                y="151"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13.5"
                fontWeight="700"
                style={{fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'}}
              >
                Logements (eau chaude)
              </text>
              <text
                x="725"
                y="165"
                textAnchor="middle"
                fill="var(--mute)"
                fontSize="11"
                fontWeight="500"
              >
                {active.logementsAction}
              </text>

              {/* Connector between PAC and Logements */}
              <line
                x1="725"
                y1="172"
                x2="725"
                y2="180"
                stroke="var(--pipe)"
                strokeWidth="6"
              />
              <line
                x1="725"
                y1="172"
                x2="725"
                y2="180"
                stroke="var(--accent)"
                strokeWidth="2.5"
              />

              {/* PAC Logements + Pastille 'i' */}
              <g>
                {/* Concentric pulse rings when PAC is active */}
                {fLogements !== 0 && (
                  <g aria-hidden="true" style={{pointerEvents: 'none'}}>
                    <rect
                      x="680"
                      y="178"
                      width="90"
                      height="36"
                      rx="10"
                      fill="none"
                      stroke={fLogements > 0 ? 'var(--accent)' : 'var(--sea-wave)'}
                      strokeWidth="2"
                      className="pac-pulse-ring"
                    />
                    <rect
                      x="680"
                      y="178"
                      width="90"
                      height="36"
                      rx="10"
                      fill="none"
                      stroke={fLogements > 0 ? 'var(--accent)' : 'var(--sea-wave)'}
                      strokeWidth="1.5"
                      className="pac-pulse-ring pac-pulse-ring-delay"
                    />
                  </g>
                )}
                <rect
                  x="682"
                  y="180"
                  width="86"
                  height="32"
                  rx="8"
                  fill={activeComp === 'pac-logements' ? 'var(--accent)' : 'var(--card)'}
                  stroke={fLogements < 0 ? 'var(--sea-wave)' : 'var(--accent)'}
                  strokeWidth={activeComp === 'pac-logements' ? '2.25' : '1.75'}
                />
                <text
                  x="716"
                  y="201"
                  textAnchor="middle"
                  fill={activeComp === 'pac-logements' ? '#ffffff' : 'var(--ink)'}
                  fontSize="13"
                  fontWeight="700"
                  style={{fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'}}
                >
                  PAC
                </text>
                <g
                  transform="translate(752, 196)"
                  {...interactiveProps('pac-logements', 'Pompe à chaleur des logements')}
                >
                  <circle r="22" fill="transparent" />
                  <circle
                    r="9.5"
                    fill={activeComp === 'pac-logements' ? 'rgba(255,255,255,0.22)' : 'var(--surface-subtle)'}
                    stroke={activeComp === 'pac-logements' ? '#ffffff' : 'var(--accent)'}
                    strokeWidth="1.4"
                  />
                  <text
                    x="0"
                    y="3.8"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={activeComp === 'pac-logements' ? '#ffffff' : 'var(--ink)'}
                  >
                    i
                  </text>
                </g>
              </g>
            </g>

            {/* ================= LOOP LABEL ================= */}
            <text
              x="594"
              y="344"
              textAnchor="middle"
              fill="var(--ink)"
              fontSize="14"
              fontWeight="700"
              style={{fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'}}
            >
              Boucle d’eau tempérée
            </text>
            <text
              x="594"
              y="362"
              textAnchor="middle"
              fill="var(--mute)"
              fontSize="12"
              fontWeight="500"
            >
              Tuyau aller-retour partagé entre les bâtiments
            </text>
          </svg>

          {/* Tooltip flottant ancré sur la pastille 'i' survolée ou touchée */}
          {activeDef && (
            <div
              role="tooltip"
              aria-live="polite"
              className={`absolute z-20 rounded-xl border border-[var(--accent)] bg-[var(--card)] p-3.5 shadow-xl transition-opacity duration-150 ${activeDef.tooltipClass}`}
            >
              <span
                aria-hidden="true"
                className={`absolute h-3 w-3 rotate-45 border border-[var(--accent)] bg-[var(--card)] ${activeDef.caretClass}`}
              />
              <div className="relative z-10 flex items-start justify-between gap-2.5 rounded-lg bg-[var(--card)]">
                <div>
                  <p className="font-display m-0 text-[0.94rem] font-bold text-[var(--ink)]">
                    {activeDef.title}
                  </p>
                  <p className="m-0 text-[0.76rem] font-medium text-[var(--accent)]">
                    {activeDef.subtitle}
                  </p>
                </div>
                {pinnedComp && (
                  <button
                    type="button"
                    onClick={() => {
                      setPinnedComp(null);
                      setHoveredComp(null);
                    }}
                    aria-label="Fermer l’infobulle"
                    className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[var(--line)] bg-[var(--bg)] text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="relative z-10 mt-1.5 mb-0 text-[0.84rem] leading-snug text-[var(--ink)]">
                {activeDef.description}
              </p>
            </div>
          )}
        </div>

        {/* Compact visual color-code legend */}
        <div
          className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-2 text-[0.83rem] text-[var(--ink)]"
          aria-label="Légende du code couleur du schéma"
        >
          <span className="inline-flex items-center gap-2">
            <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden="true" className="shrink-0">
              <line
                x1="1"
                y1="5"
                x2="25"
                y2="5"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="5 5"
              />
            </svg>
            <span>
              <strong>Orange</strong> : circulation de chaleur / PAC en chauffage
            </span>
          </span>

          <span className="inline-flex items-center gap-2">
            <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true" className="shrink-0">
              <rect
                x="1.5"
                y="1.5"
                width="15"
                height="11"
                rx="3"
                fill="var(--sea)"
                stroke="var(--sea-wave)"
                strokeWidth="2"
              />
            </svg>
            <span>
              <strong>Bleu</strong> : eau de mer / PAC en refroidissement (rejet de chaleur)
            </span>
          </span>

          <span className="inline-flex items-center gap-2">
            <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden="true" className="shrink-0">
              <line
                x1="2"
                y1="5"
                x2="24"
                y2="5"
                stroke="var(--pipe)"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <line
                x1="2"
                y1="5"
                x2="24"
                y2="5"
                stroke="var(--pipe-inner)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span>
              <strong>Gris</strong> : tuyau d’eau tempérée (aller-retour)
            </span>
          </span>
        </div>

        {/* Legend & interactive hint */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-[0.85rem] text-[var(--mute)]">
          <p className="m-0">
            <strong className="font-semibold text-[var(--ink)]">PAC : pompe à chaleur.</strong>{' '}
            Les pointillés orange montrent le sens de circulation de la chaleur.
          </p>
          <p className="m-0 text-[0.82rem] text-[var(--mute)]">
            Survole ou touche une pastille « i » pour lire le rôle de chaque élément.
          </p>
        </div>

        {/* Dynamic explanation for selected mode */}
        <p
          id="mtxt"
          aria-live="polite"
          className="mt-3 mb-4 text-[1rem] leading-relaxed text-[var(--ink)] sm:text-[1.05rem]"
        >
          {active.explanation}
        </p>

        {/* Key renewable & GHG facts with hover/tap transparency tooltips */}
        <div className="relative flex flex-wrap gap-2.5 border-t border-[var(--line)] pt-4">
          {(['renewable', 'emissions'] as FactKey[]).map((key) => {
            const fact = FACT_TOOLTIPS[key];
            const isOpen = activeFact === key;
            return (
              <div key={key} className="sm:relative">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-describedby={isOpen ? `fact-tooltip-${key}` : undefined}
                  onMouseEnter={() => setHoveredFact(key)}
                  onMouseLeave={() =>
                    setHoveredFact((prev) => (prev === key ? null : prev))
                  }
                  onFocus={() => setHoveredFact(key)}
                  onBlur={() =>
                    setHoveredFact((prev) => (prev === key ? null : prev))
                  }
                  onClick={() =>
                    setPinnedFact((prev) => (prev === key ? null : key))
                  }
                  className={`inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-left text-[0.88rem] font-medium tabular-nums transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    isOpen
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]'
                      : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)]'
                  }`}
                >
                  <span>{fact.label}</span>
                  <span
                    aria-hidden="true"
                    className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[0.68rem] font-bold ${
                      isOpen
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                        : 'border-[var(--line)] bg-[var(--card)] text-[var(--mute)]'
                    }`}
                  >
                    i
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`fact-tooltip-${key}`}
                    role="tooltip"
                    className="absolute bottom-full left-0 z-30 mb-2 w-full rounded-xl border border-[var(--accent)] bg-[var(--card)] p-3.5 shadow-xl sm:w-[330px]"
                  >
                    <span
                      aria-hidden="true"
                      className="hidden sm:block sm:absolute sm:-bottom-1.5 sm:left-6 sm:h-3 sm:w-3 sm:rotate-45 sm:border-r sm:border-b sm:border-[var(--accent)] sm:bg-[var(--card)]"
                    />
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display m-0 text-[0.9rem] font-bold text-[var(--accent)]">
                        {fact.title}
                      </p>
                      {pinnedFact === key && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPinnedFact(null);
                            setHoveredFact(null);
                          }}
                          aria-label="Fermer l’explication"
                          className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[var(--line)] bg-[var(--bg)] text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <p className="mt-1 mb-0 text-[0.84rem] leading-snug text-[var(--ink)] tabular-nums">
                      {fact.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <EnergySourcesExplorer />
    </main>
  );
}
