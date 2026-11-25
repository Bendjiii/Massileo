import {ChevronLeft, ChevronRight} from 'lucide-react';
import {type KeyboardEvent, useState} from 'react';

type LifecycleStepId = 'prelevement' | 'echange' | 'distribution' | 'rejet';

interface LifecycleStep {
  id: LifecycleStepId;
  number: string;
  label: string;
  title: string;
  circuitType: string;
  description: string;
  keyTakeaway: string;
}

const STEPS: LifecycleStep[] = [
  {
    id: 'prelevement',
    number: '01',
    label: 'Prélèvement',
    title: '01. Prélèvement : puiser l’eau de mer en profondeur',
    circuitType: 'Circuit ouvert · Eau de mer',
    description:
      'Une station de pompage aspire doucement l’eau de la mer Méditerranée à plusieurs mètres de profondeur, là où sa température reste presque constante toute l’année (entre 13 °C et 25 °C). Une grille filtrante protège les poissons et les algues à l’entrée du tuyau.',
    keyTakeaway:
      'L’eau de mer est filtrée mécaniquement pour retenir les débris, sans aucun produit chimique ajouté.',
  },
  {
    id: 'echange',
    number: '02',
    label: 'Échange thermique',
    title: '02. Échange thermique : transférer la chaleur sans mélanger les eaux',
    circuitType: 'Interface · Échangeur à plaques',
    description:
      'Dans la centrale thalassothermique, l’eau de mer longe de fines plaques de titane qui séparent deux circuits. Elle cède sa chaleur (ou sa fraîcheur) à l’eau douce de la boucle du quartier : les deux eaux ne se mélangent jamais.',
    keyTakeaway:
      'La mer reste salée à l’extérieur, tandis que la boucle du quartier fonctionne en circuit fermé avec de l’eau douce propre.',
  },
  {
    id: 'distribution',
    number: '03',
    label: 'Distribution',
    title: '03. Distribution : alimenter les bâtiments via la boucle tempérée',
    circuitType: 'Circuit fermé · Eau douce tempérée',
    description:
      'L’eau douce tempérée circule en continu dans des tuyaux aller-retour enterrés sous l’écoquartier Les Fabriques. Dans chaque immeuble de bureaux ou de logements, une pompe à chaleur (PAC) utilise cette énergie pour chauffer, rafraîchir ou produire l’eau chaude.',
    keyTakeaway:
      'La même eau douce tourne en boucle fermée : elle n’est pas gaspillée et peut même transférer la chaleur d’un bâtiment à un autre.',
  },
  {
    id: 'rejet',
    number: '04',
    label: 'Rejet',
    title: '04. Rejet : restituer une eau propre à la Méditerranée',
    circuitType: 'Circuit ouvert · Retour en mer',
    description:
      'Une fois son énergie thermique échangée dans la centrale, l’eau de mer repart par une conduite sous-marine vers le large. Elle est simplement plus fraîche ou plus tiède de quelques degrés et retrouve son milieu naturel sans aucune pollution.',
    keyTakeaway:
      'La variation de température au point de rejet reste très faible afin de préserver la faune et la flore marines.',
  },
];

function StepIllustration({stepId}: {stepId: LifecycleStepId}) {
  return (
    <svg
      viewBox="0 0 460 280"
      className="block h-auto w-full select-none"
      role="img"
      aria-label={`Illustration de l’étape : ${stepId}`}
    >
      <defs>
        <linearGradient id="carouselSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sky-top)" />
          <stop offset="100%" stopColor="var(--sky-bot)" />
        </linearGradient>
      </defs>

      {/* Sky & Coastal Ground */}
      <rect x="0" y="0" width="460" height="280" rx="12" fill="url(#carouselSky)" />
      <path d="M180,152 L460,152 L460,280 L180,280 Z" fill="var(--subsoil)" />
      <rect x="180" y="142" width="280" height="14" fill="var(--ground)" />

      {/* Sea zone on left */}
      <path
        d="M0,150 Q45,142 90,150 T180,150 L180,280 L0,280 Z"
        fill="var(--sea)"
      />
      <path
        className="massileo-wave"
        d="M14,168 q18,-5 36,0 t36,0 t36,0 t36,0"
        fill="none"
        stroke="var(--sea-wave)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <text x="86" y="262" textAnchor="middle" fill="var(--ink)" fontSize="11.5" fontWeight="600">
        Mer Méditerranée
      </text>

      {/* Step 1: Prélèvement */}
      {stepId === 'prelevement' && (
        <g>
          {/* Intake pipe from deep sea */}
          <path className="massileo-pipe-outer" d="M52,216 H204 V140 H240" />
          <path className="massileo-pipe-inner" d="M52,216 H204 V140 H240" />
          <path className="massileo-flow" d="M52,216 H204 V140 H240" />

          {/* Protective intake screen */}
          <rect
            x="34"
            y="202"
            width="24"
            height="28"
            rx="6"
            fill="var(--card)"
            stroke="var(--sea-wave)"
            strokeWidth="2"
          />
          <line x1="41" y1="207" x2="41" y2="225" stroke="var(--sea-wave)" strokeWidth="2" />
          <line x1="47" y1="207" x2="47" y2="225" stroke="var(--sea-wave)" strokeWidth="2" />
          <line x1="53" y1="207" x2="53" y2="225" stroke="var(--sea-wave)" strokeWidth="2" />

          {/* Pump station */}
          <rect
            x="236"
            y="108"
            width="104"
            height="58"
            rx="10"
            fill="var(--card)"
            stroke="var(--accent)"
            strokeWidth="2"
          />
          <circle cx="288" cy="133" r="14" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.75" />
          <path
            d="M284,127 L295,133 L284,139 Z"
            fill="var(--accent)"
          />
          <text x="288" y="158" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="700">
            Station de pompage
          </text>

          {/* Depth callout */}
          <line x1="22" y1="154" x2="22" y2="216" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <text x="48" y="190" fill="var(--ink)" fontSize="11" fontWeight="600">
            13 °C – 25 °C
          </text>
          <text x="394" y="136" textAnchor="middle" fill="var(--mute)" fontSize="11" fontWeight="500">
            Vers l’échangeur
          </text>
        </g>
      )}

      {/* Step 2: Échange thermique */}
      {stepId === 'echange' && (
        <g>
          {/* Seawater side (left) */}
          <path className="massileo-pipe-outer" d="M64,186 H178" />
          <path className="massileo-pipe-inner" d="M64,186 H178" />
          <path className="massileo-flow" d="M64,186 H178" />

          {/* Freshwater loop side (right) */}
          <path className="massileo-pipe-outer" d="M282,162 H410 V208 H282" />
          <path className="massileo-pipe-inner" d="M282,162 H410 V208 H282" />
          <path className="massileo-flow" d="M282,162 H410 V208 H282" />

          {/* Titanium plate exchanger cutaway */}
          <rect
            x="178"
            y="124"
            width="104"
            height="108"
            rx="12"
            fill="var(--card)"
            stroke="var(--accent)"
            strokeWidth="2"
          />
          {/* Alternating blue (sea) and orange (freshwater) plates */}
          {[196, 210, 224, 238, 252, 266].map((px, i) => (
            <line
              key={px}
              x1={px}
              y1="140"
              x2={px}
              y2="206"
              stroke={i % 2 === 0 ? 'var(--sea-wave)' : 'var(--accent)'}
              strokeWidth="4"
              strokeLinecap="round"
            />
          ))}
          <text x="230" y="222" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="700">
            Échangeur à plaques
          </text>
          <text x="118" y="170" textAnchor="middle" fill="var(--ink)" fontSize="10.5" fontWeight="600">
            Eau de mer
          </text>
          <text x="352" y="146" textAnchor="middle" fill="var(--ink)" fontSize="10.5" fontWeight="600">
            Eau douce
          </text>
          <text x="352" y="232" textAnchor="middle" fill="var(--mute)" fontSize="10.5" fontWeight="500">
            Sans jamais se mélanger
          </text>
        </g>
      )}

      {/* Step 3: Distribution */}
      {stepId === 'distribution' && (
        <g>
          {/* Closed district loop */}
          <path className="massileo-pipe-outer" d="M186,184 H414 V220 H186 Z" />
          <path className="massileo-pipe-inner" d="M186,184 H414 V220 H186 Z" />
          {/* Branches to buildings */}
          <path className="massileo-pipe-outer" d="M262,184 V134 M370,184 V134" />
          <path className="massileo-pipe-inner" d="M262,184 V134 M370,184 V134" />

          <path className="massileo-flow" d="M186,184 H414 V220 H186 Z" />
          <path className="massileo-flow" d="M262,184 V134" />
          <path className="massileo-flow" d="M370,184 V134" />

          {/* Exchanger source marker */}
          <rect
            x="148"
            y="174"
            width="42"
            height="56"
            rx="8"
            fill="var(--card)"
            stroke="var(--line)"
            strokeWidth="1.75"
          />
          <text x="169" y="206" textAnchor="middle" fill="var(--ink)" fontSize="10" fontWeight="700">
            Centrale
          </text>

          {/* Bureaux */}
          <rect
            x="222"
            y="58"
            width="80"
            height="62"
            rx="8"
            fill="var(--card)"
            stroke="var(--line)"
            strokeWidth="1.75"
          />
          <text x="262" y="88" textAnchor="middle" fill="var(--ink)" fontSize="11.5" fontWeight="700">
            Bureaux
          </text>
          <rect
            x="239"
            y="122"
            width="46"
            height="22"
            rx="6"
            fill="var(--card)"
            stroke="var(--accent)"
            strokeWidth="1.75"
          />
          <text x="262" y="137" textAnchor="middle" fill="var(--ink)" fontSize="10.5" fontWeight="700">
            PAC
          </text>

          {/* Logements */}
          <rect
            x="330"
            y="58"
            width="80"
            height="62"
            rx="8"
            fill="var(--card)"
            stroke="var(--line)"
            strokeWidth="1.75"
          />
          <text x="370" y="88" textAnchor="middle" fill="var(--ink)" fontSize="11.5" fontWeight="700">
            Logements
          </text>
          <rect
            x="347"
            y="122"
            width="46"
            height="22"
            rx="6"
            fill="var(--card)"
            stroke="var(--accent)"
            strokeWidth="1.75"
          />
          <text x="370" y="137" textAnchor="middle" fill="var(--ink)" fontSize="10.5" fontWeight="700">
            PAC
          </text>

          <text x="302" y="246" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="600">
            Boucle d’eau tempérée (circuit fermé)
          </text>
        </g>
      )}

      {/* Step 4: Rejet */}
      {stepId === 'rejet' && (
        <g>
          {/* Return pipe back to the sea */}
          <path className="massileo-pipe-outer" d="M242,140 H206 V218 H68" />
          <path className="massileo-pipe-inner" d="M242,140 H206 V218 H68" />
          <path className="massileo-flow" d="M242,140 H206 V218 H68" />

          {/* Station */}
          <rect
            x="240"
            y="112"
            width="102"
            height="56"
            rx="10"
            fill="var(--card)"
            stroke="var(--line)"
            strokeWidth="1.75"
          />
          <text x="291" y="144" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="700">
            Échangeur
          </text>

          {/* Diffuser nozzle in sea */}
          <circle cx="64" cy="218" r="11" fill="var(--card)" stroke="var(--sea-wave)" strokeWidth="2" />
          <path d="M54,218 L40,210 M54,218 L38,218 M54,218 L40,226" stroke="var(--sea-wave)" strokeWidth="2" strokeLinecap="round" />

          {/* Clean sea badge */}
          <rect
            x="194"
            y="194"
            width="238"
            height="46"
            rx="8"
            fill="var(--card)"
            stroke="var(--accent)"
            strokeWidth="1.5"
          />
          <text x="313" y="214" textAnchor="middle" fill="var(--ink)" fontSize="11.5" fontWeight="700">
            Eau de mer non polluée
          </text>
          <text x="313" y="230" textAnchor="middle" fill="var(--mute)" fontSize="10.5" fontWeight="500">
            Restituée propre avec un faible écart de °C
          </text>
        </g>
      )}
    </svg>
  );
}

export default function WaterLifecycleCarousel({
  className = 'mt-8 sm:mt-10',
}: {
  className?: string;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const goPrev = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    setStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowLeft') {
      goPrev();
    } else if (e.key === 'ArrowRight') {
      goNext();
    }
  };

  return (
    <section
      className={className}
      aria-labelledby="cycle-eau-title"
      onKeyDown={handleKeyDown}
    >
      <header className="mb-4 sm:mb-5">
        <h2
          id="cycle-eau-title"
          className="font-display text-xl font-bold tracking-tight text-[var(--ink)] sm:text-[1.5rem] [text-wrap:balance]"
        >
          Le cycle de vie de l’eau dans le quartier Massileo
        </h2>
        <p className="mt-1 text-[0.95rem] text-[var(--mute)]">
          Parcours les 4 étapes clés pour comprendre comment l’eau circule et préserve la mer.
        </p>
      </header>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-6">
        {/* Step selector tabs (style Genially stepper) */}
        <div
          className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
          role="tablist"
          aria-label="Étapes du cycle de vie de l’eau"
        >
          {STEPS.map((step, idx) => {
            const isSelected = idx === stepIndex;
            return (
              <button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setStepIndex(idx)}
                className={`min-h-[44px] cursor-pointer rounded-lg border px-3 py-2 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                    : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)]'
                }`}
              >
                <span className="block text-[0.75rem] opacity-85 tabular-nums">
                  Étape {step.number}
                </span>
                <span className="block truncate text-[0.9rem] font-semibold">
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Carousel Slide Content */}
        <div
          role="tabpanel"
          aria-live="polite"
          className="grid items-stretch gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface-subtle)] p-3 sm:p-4 lg:grid-cols-12"
        >
          {/* Visual schematic side */}
          <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--card)] lg:col-span-6">
            <StepIllustration stepId={currentStep.id} />
          </div>

          {/* Textual explanation side */}
          <div className="flex flex-col justify-between gap-3 rounded-lg bg-[var(--card)] p-4 border border-[var(--line)] lg:col-span-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[0.82rem] font-medium text-[var(--mute)] tabular-nums">
                <span className="font-semibold text-[var(--accent)]">
                  Étape {stepIndex + 1} sur {STEPS.length}
                </span>
                <span aria-hidden="true">·</span>
                <span>{currentStep.circuitType}</span>
              </div>

              <h3 className="font-display mt-2 text-[1.12rem] font-bold leading-snug text-[var(--ink)]">
                {currentStep.title}
              </h3>

              <p className="mt-2 mb-0 text-[0.96rem] leading-relaxed text-[var(--ink)] tabular-nums">
                {currentStep.description}
              </p>
            </div>

            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] p-3">
              <p className="m-0 text-[0.82rem] font-semibold text-[var(--accent)]">
                À retenir
              </p>
              <p className="mt-0.5 mb-0 text-[0.88rem] leading-snug text-[var(--ink)]">
                {currentStep.keyTakeaway}
              </p>
            </div>
          </div>
        </div>

        {/* Previous / Next Controls + Step Indicators */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={isFirst}
            className={`inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-lg border px-4 py-2 text-[0.92rem] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
              isFirst
                ? 'cursor-not-allowed border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] opacity-45'
                : 'cursor-pointer border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)]'
            }`}
          >
            <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            Précédent
          </button>

          <div
            className="flex items-center gap-2"
            aria-label="Progression des étapes"
          >
            {STEPS.map((step, idx) => {
              const isSelected = idx === stepIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setStepIndex(idx)}
                  aria-label={`Aller à l’étape ${idx + 1} : ${step.label}`}
                  aria-current={isSelected ? 'step' : undefined}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  <span
                    className={`block rounded-full transition-all duration-150 ${
                      isSelected
                        ? 'h-3 w-7 bg-[var(--accent)]'
                        : 'h-2.5 w-2.5 bg-[var(--line)] hover:bg-[var(--mute)]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={isLast}
            className={`inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-lg border px-4 py-2 text-[0.92rem] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
              isLast
                ? 'cursor-not-allowed border-[var(--line)] bg-[var(--bg)] text-[var(--mute)] opacity-45'
                : 'cursor-pointer border-[var(--accent)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
            }`}
          >
            Suivant
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
        </div>

        {/* Visual 4-step progress indicator below control buttons */}
        <div
          className="mt-3.5 border-t border-[var(--line)] pt-3"
          role="progressbar"
          aria-label="Progression dans le cycle de vie de l’eau"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={stepIndex + 1}
          aria-valuetext={`Étape ${stepIndex + 1} sur ${STEPS.length} : ${currentStep.label}`}
        >
          <div className="mb-1.5 flex items-center justify-between text-[0.82rem] font-medium text-[var(--mute)] tabular-nums">
            <span>
              Progression :{' '}
              <strong className="font-semibold text-[var(--ink)]">
                Étape {stepIndex + 1} / {STEPS.length}
              </strong>
            </span>
            <span className="font-semibold text-[var(--accent)]">
              {currentStep.label}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {STEPS.map((step, idx) => {
              const isReached = idx <= stepIndex;
              const isCurrent = idx === stepIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setStepIndex(idx)}
                  aria-label={`Étape ${idx + 1} sur ${STEPS.length} : ${step.label}`}
                  className="group cursor-pointer py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  <span
                    className={`block h-2 w-full rounded-full transition-colors duration-150 ${
                      isCurrent
                        ? 'bg-[var(--accent)]'
                        : isReached
                          ? 'bg-[var(--accent)] opacity-55 group-hover:opacity-80'
                          : 'bg-[var(--line)] group-hover:bg-[var(--mute)]'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
