"use client";

import NextImage from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Apple,
  ArrowDown,
  ArrowRight,
  BarChart3,
  Bike,
  CarFront,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  Clock3,
  Compass,
  Heart,
  Headphones,
  LocateFixed,
  MapPin,
  Menu,
  Navigation,
  PackageCheck,
  ReceiptText,
  Route,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Store,
  UtensilsCrossed,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import {
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ComponentProps,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ZodType } from "zod";

import {
  customerSchema,
  driverSchema,
  restaurantSchema,
  type InterestType,
} from "../../lib/forms";

type ModalKind = "restaurant" | "driver" | "privacy" | "terms" | null;
type FeatureKey = "discover" | "details" | "track" | "checkout";
type FormStatus = "idle" | "submitting" | "success" | "error";

function Image(props: ComponentProps<typeof NextImage>) {
  return (
    <NextImage
      {...props}
      unoptimized={process.env.NODE_ENV !== "production"}
    />
  );
}

const featureTabs: Array<{
  id: FeatureKey;
  label: string;
  note: string;
  icon: typeof Compass;
}> = [
  {
    id: "discover",
    label: "Discover",
    note: "Search, filters & favourites",
    icon: Compass,
  },
  {
    id: "details",
    label: "Choose",
    note: "Clear food details",
    icon: UtensilsCrossed,
  },
  {
    id: "track",
    label: "Track",
    note: "Live order progress",
    icon: Navigation,
  },
  {
    id: "checkout",
    label: "Checkout",
    note: "Cart & secure payment",
    icon: WalletCards,
  },
];

const faqs = [
  {
    question: "When will ONDI launch?",
    answer:
      "We’re currently building the launch network and testing the first version. There’s no public date yet; waitlist members will hear first when early access opens.",
  },
  {
    question: "Where will it be available?",
    answer:
      "Kingston and St. Andrew are the first route. We’ll expand carefully based on restaurant coverage, driver availability and what the launch community tells us.",
  },
  {
    question: "How can customers get early access?",
    answer:
      "Join the launch list with your email and location. We’ll send product updates and invite small groups to test ONDI before the wider release.",
  },
  {
    question: "How can restaurants join?",
    answer:
      "Complete the founding-restaurant form with a few business details. Our launch team will follow up to learn about your menu, operations and delivery needs.",
  },
  {
    question: "What does a launch partnership involve?",
    answer:
      "It starts with an onboarding conversation, menu setup and practical launch planning. Final commercial terms and operating details will be shared directly before any commitment.",
  },
  {
    question: "How can drivers apply?",
    answer:
      "Use the early-driver form and tell us your location, vehicle type and general availability. We don’t ask for ID numbers or document uploads at this stage.",
  },
  {
    question: "Will ONDI be on iOS and Android?",
    answer:
      "Yes. The customer app is being designed for iPhone and Android. Official download links will only appear once the app is ready for release.",
  },
  {
    question: "How will applicants be contacted?",
    answer:
      "We’ll use the email or phone number supplied in the relevant form. ONDI will never ask for payment, passwords or sensitive identity documents in a first-contact message.",
  },
];

const schemasByType: Record<InterestType, ZodType> = {
  customer: customerSchema,
  restaurant: restaurantSchema,
  driver: driverSchema,
};

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <a
      className={`brand-mark${inverse ? " brand-mark--inverse" : ""}`}
      href="#top"
      aria-label="ONDI home"
    >
      <span className="brand-mark__pin" aria-hidden="true">
        <span />
      </span>
      <span className="brand-mark__word">ONDI</span>
    </a>
  );
}

function SectionLabel({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`section-label${light ? " section-label--light" : ""}`}>
      <span className="section-label__dot" aria-hidden="true" />
      {children}
    </div>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function PrimaryLink({
  href,
  children,
  inverse = false,
  onClick,
}: {
  href: string;
  children: ReactNode;
  inverse?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      className={`button button--primary${inverse ? " button--inverse" : ""}`}
      href={href}
      onClick={onClick}
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} />
    </a>
  );
}

function HeroPreview() {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    });
  };

  return (
    <div
      className="hero-preview"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      aria-label="Preview of the ONDI mobile ordering experience"
    >
      <div className="hero-preview__halo" aria-hidden="true" />

      <motion.div
        className="hero-preview__route"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        aria-hidden="true"
      >
        <span className="route-line route-line--one" />
        <span className="route-line route-line--two" />
        <span className="route-line route-line--three" />
        <span className="route-node route-node--start" />
        <span className="route-node route-node--end">
          <MapPin size={25} fill="currentColor" />
        </span>
      </motion.div>

      <motion.div
        className="hero-phone"
        initial={reduceMotion ? false : { opacity: 0, y: 54, rotate: 5 }}
        animate={{
          opacity: 1,
          y: tilt.y * -6,
          x: tilt.x * 5,
          rotate: -2 + tilt.x * 1.5,
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="phone-shell">
          <div className="phone-speaker" aria-hidden="true" />
          <div className="phone-status">
            <span>9:41</span>
            <span className="phone-status__icons" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>
          <div className="phone-location">
            <div>
              <span>DELIVER TO</span>
              <strong>New Kingston</strong>
            </div>
            <div className="phone-avatar">M</div>
          </div>
          <div className="phone-search">
            <Search size={15} aria-hidden="true" />
            <span>What are you craving?</span>
          </div>
          <div className="phone-chips" aria-hidden="true">
            <span className="is-active">Near me</span>
            <span>Jamaican</span>
            <span>Lunch</span>
          </div>
          <article className="phone-featured-card">
            <div className="phone-featured-card__image">
              <Image
                src="/brown-stew-fish.jpg"
                alt="Brown-stew fish with rice and peas"
                fill
                sizes="260px"
                priority
              />
              <span className="phone-featured-card__time">
                <Clock3 size={11} /> Opens soon
              </span>
            </div>
            <div className="phone-featured-card__copy">
              <div>
                <span>Jamaican comfort food</span>
                <h3>Yardie Bowl</h3>
              </div>
              <Heart size={17} aria-label="Save Yardie Bowl" />
            </div>
            <div className="phone-featured-card__meta">
              <span>★ 4.8 preview</span>
              <span>$$</span>
              <span>New Kingston</span>
            </div>
          </article>
          <div className="phone-list-heading">
            <strong>Popular picks</strong>
            <span>See all</span>
          </div>
          <div className="phone-mini-row">
            <div className="phone-mini-row__image">
              <Image
                src="/ackee-breakfast.jpg"
                alt=""
                fill
                sizes="48px"
              />
            </div>
            <div>
              <strong>Ackee Morning Box</strong>
              <span>Portland Pot · $</span>
            </div>
            <span className="phone-mini-row__add">+</span>
          </div>
          <div className="phone-tabs" aria-hidden="true">
            <span className="is-active">
              <Compass size={17} />
            </span>
            <span>
              <Search size={17} />
            </span>
            <span>
              <ReceiptText size={17} />
            </span>
            <span>
              <Heart size={17} />
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="order-notice"
        initial={reduceMotion ? false : { opacity: 0, x: 30, y: -8 }}
        animate={{
          opacity: 1,
          x: tilt.x * -13,
          y: tilt.y * -9,
          rotate: 2 + tilt.x,
        }}
        transition={{ duration: 0.7, delay: 0.45 }}
      >
        <div className="order-notice__icon">
          <Bike size={19} aria-hidden="true" />
        </div>
        <div>
          <span>ORDER UPDATE</span>
          <strong>Rider picked up</strong>
        </div>
        <span className="order-notice__live">LIVE</span>
      </motion.div>

      <motion.div
        className="hero-food-card"
        initial={reduceMotion ? false : { opacity: 0, x: -30, rotate: -8 }}
        animate={{
          opacity: 1,
          x: tilt.x * 15,
          y: tilt.y * 10,
          rotate: -7 + tilt.x * -2,
        }}
        transition={{ duration: 0.75, delay: 0.3 }}
      >
        <div className="hero-food-card__image">
          <Image
            src="/ackee-breakfast.jpg"
            alt="Ackee and saltfish with fried dumplings"
            fill
            sizes="140px"
            priority
          />
        </div>
        <div>
          <span>LOCAL FAVOURITE</span>
          <strong>Ackee Morning Box</strong>
        </div>
      </motion.div>

      <motion.div
        className="order-progress-card"
        initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: -4 }}
        animate={{
          opacity: 1,
          x: tilt.x * -9,
          y: tilt.y * -7,
          rotate: -3 - tilt.x,
        }}
        transition={{ duration: 0.8, delay: 0.55 }}
      >
        <div className="order-progress-card__top">
          <span>Your order</span>
          <strong>#0187</strong>
        </div>
        <div className="order-progress-card__bar">
          <span className="is-done" />
          <span className="is-done" />
          <span className="is-current" />
          <span />
        </div>
        <div className="order-progress-card__copy">
          <div>
            <span>ON DI WAY</span>
            <strong>Heading to you</strong>
          </div>
          <LocateFixed size={21} aria-hidden="true" />
        </div>
      </motion.div>
    </div>
  );
}

function FeatureScreen({ active }: { active: FeatureKey }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active}
        className="showcase-phone__screen"
        inert
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
        transition={{ duration: 0.28 }}
      >
        {active === "discover" && (
          <div className="app-screen app-screen--discover">
            <div className="app-screen__eyebrow">NEW KINGSTON</div>
            <div className="app-screen__heading">
              <h3>What’s good?</h3>
              <div className="mini-avatar">M</div>
            </div>
            <div className="app-search">
              <Search size={15} />
              Search dishes or places
              <SlidersHorizontal size={15} />
            </div>
            <div className="filter-row">
              <span className="is-on">Nearby</span>
              <span>Jamaican</span>
              <span>Under $</span>
            </div>
            <div className="screen-food-card screen-food-card--large">
              <div className="screen-food-card__image">
                <Image
                  src="/brown-stew-fish.jpg"
                  alt="Brown-stew fish lunch"
                  fill
                  sizes="280px"
                />
                <button type="button" aria-label="Save this restaurant">
                  <Heart size={15} />
                </button>
              </div>
              <div className="screen-food-card__content">
                <div>
                  <strong>Yardie Bowl</strong>
                  <span>Jamaican · New Kingston</span>
                </div>
                <span className="rating">★ 4.8</span>
              </div>
            </div>
            <div className="screen-section-title">
              <strong>Near you</strong>
              <span>See all</span>
            </div>
            <div className="screen-food-split">
              <div>
                <Image
                  src="/ackee-breakfast.jpg"
                  alt=""
                  fill
                  sizes="120px"
                />
                <span>Portland Pot</span>
              </div>
              <div>
                <Image src="/sweet-beans.jpg" alt="" fill sizes="120px" />
                <span>Sweet Spot</span>
              </div>
            </div>
          </div>
        )}

        {active === "details" && (
          <div className="app-screen app-screen--details">
            <div className="detail-hero">
              <Image
                src="/ackee-breakfast.jpg"
                alt="Ackee and saltfish breakfast box"
                fill
                sizes="300px"
              />
              <button type="button" aria-label="Go back">
                <ArrowDown size={18} />
              </button>
              <button type="button" aria-label="Save this dish">
                <Heart size={17} />
              </button>
            </div>
            <div className="detail-copy">
              <span className="detail-kicker">PORTLAND POT</span>
              <h3>Ackee Morning Box</h3>
              <p>
                Ackee, saltfish, callaloo and two golden fried dumplings.
              </p>
              <div className="detail-meta">
                <span>
                  <Sparkles size={13} /> Local pick
                </span>
                <span>Mild</span>
              </div>
              <div className="detail-choice">
                <div>
                  <strong>Choose a side</strong>
                  <span>Required</span>
                </div>
                <label>
                  <span>Fried plantain</span>
                  <span className="radio is-on" />
                </label>
                <label>
                  <span>Festival</span>
                  <span className="radio" />
                </label>
              </div>
              <button className="app-add-button" type="button">
                <span>1</span>
                Add to order
                <strong>$</strong>
              </button>
            </div>
          </div>
        )}

        {active === "track" && (
          <div className="app-screen app-screen--track">
            <div className="track-map">
              <div className="map-road map-road--a" />
              <div className="map-road map-road--b" />
              <div className="map-road map-road--c" />
              <div className="map-block map-block--a" />
              <div className="map-block map-block--b" />
              <div className="map-block map-block--c" />
              <div className="map-route">
                <span />
                <span />
                <span />
              </div>
              <div className="map-rider">
                <Bike size={17} />
              </div>
              <div className="map-destination">
                <MapPin size={23} fill="currentColor" />
              </div>
              <div className="track-topbar">
                <button type="button" aria-label="Go back">
                  <ArrowDown size={17} />
                </button>
                <strong>Order #0187</strong>
                <button type="button" aria-label="Get order help">
                  <Headphones size={17} />
                </button>
              </div>
            </div>
            <div className="track-sheet">
              <span className="sheet-handle" />
              <div className="track-status">
                <div>
                  <span>ON DI WAY</span>
                  <h3>Your rider is moving</h3>
                  <p>Follow each handoff right here.</p>
                </div>
                <div className="rider-avatar">K</div>
              </div>
              <div className="track-timeline">
                <div className="is-complete">
                  <Check size={12} />
                  <span>Order confirmed</span>
                </div>
                <div className="is-complete">
                  <Check size={12} />
                  <span>Picked up</span>
                </div>
                <div className="is-live">
                  <span />
                  <span>Heading to you</span>
                </div>
              </div>
              <button className="contact-rider" type="button">
                <span>Message rider</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {active === "checkout" && (
          <div className="app-screen app-screen--checkout">
            <div className="checkout-heading">
              <button type="button" aria-label="Go back">
                <ArrowDown size={17} />
              </button>
              <h3>Your order</h3>
              <span />
            </div>
            <div className="checkout-restaurant">
              <div className="checkout-thumb">
                <Image
                  src="/brown-stew-fish.jpg"
                  alt=""
                  fill
                  sizes="42px"
                />
              </div>
              <div>
                <strong>Yardie Bowl</strong>
                <span>1 item</span>
              </div>
              <button type="button">Edit</button>
            </div>
            <div className="checkout-item">
              <span className="item-quantity">1</span>
              <div>
                <strong>Brown Stew Lunch</strong>
                <span>Rice & peas · steamed veg</span>
              </div>
              <strong>$</strong>
            </div>
            <div className="checkout-card">
              <span className="checkout-card__chip" />
              <div>
                <span>PAYMENT</span>
                <strong>•••• 2048</strong>
              </div>
              <ShieldCheck size={19} />
            </div>
            <div className="checkout-row">
              <div className="checkout-row__icon">
                <MapPin size={17} />
              </div>
              <div>
                <span>DELIVER TO</span>
                <strong>New Kingston</strong>
              </div>
              <ChevronDown size={16} />
            </div>
            <div className="checkout-totals">
              <div>
                <span>Subtotal</span>
                <span>$</span>
              </div>
              <div>
                <span>Delivery</span>
                <span>Shown at launch</span>
              </div>
            </div>
            <button className="checkout-pay" type="button">
              <ShieldCheck size={16} />
              Secure checkout
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function buildFormData(
  type: InterestType,
  formData: FormData,
): Record<string, unknown> {
  const value = (name: string) => String(formData.get(name) ?? "").trim();

  if (type === "customer") {
    return {
      email: value("email"),
      location: value("location"),
    };
  }

  if (type === "restaurant") {
    return {
      businessName: value("businessName"),
      contactName: value("contactName"),
      email: value("email"),
      phone: value("phone"),
      location: value("location"),
      cuisine: value("cuisine"),
      locationCount: Number(value("locationCount")),
      deliverySetup: value("deliverySetup"),
      message: value("message") || undefined,
      consent: formData.get("consent") === "on",
    };
  }

  return {
    fullName: value("fullName"),
    email: value("email"),
    phone: value("phone"),
    location: value("location"),
    vehicleType: value("vehicleType"),
    licenceStatus: value("licenceStatus"),
    availability: value("availability"),
    consent: formData.get("consent") === "on",
  };
}

function useInterestForm(type: InterestType) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const onInput = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    if (!target.name || !fieldErrors[target.name]) return;

    setFieldErrors((current) => {
      const next = { ...current };
      delete next[target.name];
      return next;
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting" || status === "success") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = buildFormData(type, formData);
    const validation = schemasByType[type].safeParse(data);

    if (!validation.success) {
      const nextErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? "form");
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      });
      setFieldErrors(nextErrors);
      setMessage("Check the highlighted details and try again.");
      setStatus("error");
      return;
    }

    setFieldErrors({});
    setMessage("");
    setStatus("submitting");

    try {
      const response = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          data: validation.data,
          website: String(formData.get("website") ?? ""),
          startedAt: startedAt.current,
        }),
      });

      const body = (await response.json().catch(() => null)) as
        | {
            message?: string;
            error?: {
              message?: string;
              fieldErrors?: Record<string, string[]>;
            };
          }
        | null;

      if (!response.ok) {
        const serverErrors = body?.error?.fieldErrors;
        if (serverErrors) {
          setFieldErrors(
            Object.fromEntries(
              Object.entries(serverErrors)
                .filter(([, messages]) => messages.length > 0)
                .map(([key, messages]) => [key, messages[0]]),
            ),
          );
        }
        throw new Error(
          body?.error?.message ??
            "We couldn’t save your details. Please try again.",
        );
      }

      form.reset();
      setMessage(
        type === "customer"
          ? "You’re on di list. We’ll send the first route update to your inbox."
          : type === "restaurant"
            ? "Application received. Our launch team will be in touch."
            : "You’re in the early-driver pool. We’ll contact you about the next step.",
      );
      setStatus("success");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  };

  return { status, message, fieldErrors, onInput, onSubmit };
}

function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  return message ? (
    <span className="field-error" id={id}>
      {message}
    </span>
  ) : null;
}

function FormFeedback({
  status,
  message,
}: {
  status: FormStatus;
  message: string;
}) {
  if (!message) return null;

  return (
    <div
      className={`form-feedback form-feedback--${status}`}
      role={status === "error" ? "alert" : "status"}
    >
      {status === "success" ? (
        <CheckCircle2 size={18} aria-hidden="true" />
      ) : (
        <span className="form-feedback__mark" aria-hidden="true">
          !
        </span>
      )}
      <span>{message}</span>
    </div>
  );
}

function CustomerWaitlistForm({ compact = false }: { compact?: boolean }) {
  const form = useInterestForm("customer");

  return (
    <form
      className={`waitlist-form${compact ? " waitlist-form--compact" : ""}`}
      onSubmit={form.onSubmit}
      onInput={form.onInput}
      noValidate
    >
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={compact ? "website-compact" : "website"}>
          Website
        </label>
        <input
          id={compact ? "website-compact" : "website"}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="waitlist-form__fields">
        <div className="field-group">
          <label htmlFor={compact ? "email-compact" : "waitlist-email"}>
            Email address
          </label>
          <input
            id={compact ? "email-compact" : "waitlist-email"}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(form.fieldErrors.email)}
            aria-describedby={
              form.fieldErrors.email
                ? compact
                  ? "email-compact-error"
                  : "waitlist-email-error"
                : undefined
            }
          />
          <FieldError
            id={
              compact ? "email-compact-error" : "waitlist-email-error"
            }
            message={form.fieldErrors.email}
          />
        </div>
        <div className="field-group">
          <label htmlFor={compact ? "location-compact" : "waitlist-location"}>
            Parish or city
          </label>
          <select
            id={compact ? "location-compact" : "waitlist-location"}
            name="location"
            defaultValue=""
            aria-invalid={Boolean(form.fieldErrors.location)}
          >
            <option value="">Choose your area</option>
            <option>Kingston</option>
            <option>St. Andrew</option>
            <option>St. Catherine</option>
            <option>Elsewhere in Jamaica</option>
          </select>
          <FieldError
            id={
              compact
                ? "location-compact-error"
                : "waitlist-location-error"
            }
            message={form.fieldErrors.location}
          />
        </div>
      </div>
      <button
        className="button button--form"
        type="submit"
        disabled={form.status === "submitting" || form.status === "success"}
      >
        <span>
          {form.status === "submitting"
            ? "Joining…"
            : form.status === "success"
              ? "You’re on di list"
              : "Join the launch list"}
        </span>
        {form.status === "success" ? (
          <Check size={18} />
        ) : (
          <ArrowRight size={18} />
        )}
      </button>
      <FormFeedback status={form.status} message={form.message} />
      <p className="form-note">
        Product updates only. Unsubscribe whenever you like.
      </p>
    </form>
  );
}

function RestaurantForm() {
  const form = useInterestForm("restaurant");

  return (
    <form
      className="application-form"
      onSubmit={form.onSubmit}
      onInput={form.onInput}
      noValidate
    >
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="restaurant-website">Website</label>
        <input
          id="restaurant-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="form-grid">
        <div className="field-group field-group--wide">
          <label htmlFor="businessName">Restaurant or business name</label>
          <input
            id="businessName"
            name="businessName"
            autoComplete="organization"
            placeholder="Your restaurant name"
            autoFocus
            aria-invalid={Boolean(form.fieldErrors.businessName)}
            aria-describedby={
              form.fieldErrors.businessName ? "businessName-error" : undefined
            }
          />
          <FieldError
            id="businessName-error"
            message={form.fieldErrors.businessName}
          />
        </div>
        <div className="field-group">
          <label htmlFor="contactName">Contact person</label>
          <input
            id="contactName"
            name="contactName"
            autoComplete="name"
            placeholder="Full name"
            aria-invalid={Boolean(form.fieldErrors.contactName)}
            aria-describedby={
              form.fieldErrors.contactName ? "contactName-error" : undefined
            }
          />
          <FieldError
            id="contactName-error"
            message={form.fieldErrors.contactName}
          />
        </div>
        <div className="field-group">
          <label htmlFor="restaurantEmail">Email</label>
          <input
            id="restaurantEmail"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@restaurant.com"
            aria-invalid={Boolean(form.fieldErrors.email)}
            aria-describedby={
              form.fieldErrors.email ? "restaurantEmail-error" : undefined
            }
          />
          <FieldError
            id="restaurantEmail-error"
            message={form.fieldErrors.email}
          />
        </div>
        <div className="field-group">
          <label htmlFor="restaurantPhone">Phone or WhatsApp</label>
          <input
            id="restaurantPhone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+1 876…"
            aria-invalid={Boolean(form.fieldErrors.phone)}
            aria-describedby={
              form.fieldErrors.phone ? "restaurantPhone-error" : undefined
            }
          />
          <FieldError
            id="restaurantPhone-error"
            message={form.fieldErrors.phone}
          />
        </div>
        <div className="field-group">
          <label htmlFor="restaurantLocation">Location</label>
          <input
            id="restaurantLocation"
            name="location"
            autoComplete="street-address"
            placeholder="Area or address"
            aria-invalid={Boolean(form.fieldErrors.location)}
            aria-describedby={
              form.fieldErrors.location
                ? "restaurantLocation-error"
                : undefined
            }
          />
          <FieldError
            id="restaurantLocation-error"
            message={form.fieldErrors.location}
          />
        </div>
        <div className="field-group">
          <label htmlFor="cuisine">Cuisine type</label>
          <input
            id="cuisine"
            name="cuisine"
            placeholder="e.g. Jamaican, vegan, café"
            aria-invalid={Boolean(form.fieldErrors.cuisine)}
            aria-describedby={
              form.fieldErrors.cuisine ? "cuisine-error" : undefined
            }
          />
          <FieldError id="cuisine-error" message={form.fieldErrors.cuisine} />
        </div>
        <div className="field-group">
          <label htmlFor="locationCount">Number of locations</label>
          <input
            id="locationCount"
            name="locationCount"
            type="number"
            inputMode="numeric"
            min="1"
            max="1000"
            placeholder="1"
            aria-invalid={Boolean(form.fieldErrors.locationCount)}
            aria-describedby={
              form.fieldErrors.locationCount
                ? "locationCount-error"
                : undefined
            }
          />
          <FieldError
            id="locationCount-error"
            message={form.fieldErrors.locationCount}
          />
        </div>
        <div className="field-group field-group--wide">
          <label htmlFor="deliverySetup">Current delivery setup</label>
          <select
            id="deliverySetup"
            name="deliverySetup"
            defaultValue=""
            aria-invalid={Boolean(form.fieldErrors.deliverySetup)}
            aria-describedby={
              form.fieldErrors.deliverySetup
                ? "deliverySetup-error"
                : undefined
            }
          >
            <option value="" disabled>
              Select one
            </option>
            <option>We manage our own delivery</option>
            <option>We use third-party delivery</option>
            <option>Pickup only right now</option>
            <option>No current delivery setup</option>
            <option>It varies by location</option>
          </select>
          <FieldError
            id="deliverySetup-error"
            message={form.fieldErrors.deliverySetup}
          />
        </div>
        <div className="field-group field-group--wide">
          <label htmlFor="restaurantMessage">
            Anything useful to know? <span>Optional</span>
          </label>
          <textarea
            id="restaurantMessage"
            name="message"
            rows={3}
            placeholder="Tell us about your menu, busy periods or launch plans."
            aria-invalid={Boolean(form.fieldErrors.message)}
            aria-describedby={
              form.fieldErrors.message
                ? "restaurantMessage-error"
                : undefined
            }
          />
          <FieldError
            id="restaurantMessage-error"
            message={form.fieldErrors.message}
          />
        </div>
      </div>
      <label className="consent-row" htmlFor="restaurantConsent">
        <input
          id="restaurantConsent"
          name="consent"
          type="checkbox"
          aria-invalid={Boolean(form.fieldErrors.consent)}
          aria-describedby={
            form.fieldErrors.consent ? "restaurantConsent-error" : undefined
          }
        />
        <span className="consent-row__box">
          <Check size={13} />
        </span>
        <span>
          I agree that ONDI may contact me about becoming a launch partner.
        </span>
      </label>
      <FieldError
        id="restaurantConsent-error"
        message={form.fieldErrors.consent}
      />
      <FormFeedback status={form.status} message={form.message} />
      <button
        className="button button--form button--form-wide"
        type="submit"
        disabled={form.status === "submitting" || form.status === "success"}
      >
        <span>
          {form.status === "submitting"
            ? "Sending application…"
            : form.status === "success"
              ? "Application received"
              : "Send founding application"}
        </span>
        {form.status === "success" ? (
          <Check size={18} />
        ) : (
          <ArrowRight size={18} />
        )}
      </button>
      <p className="form-note">
        No fees or commitments at this stage—just a launch conversation.
      </p>
    </form>
  );
}

function DriverForm() {
  const form = useInterestForm("driver");

  return (
    <form
      className="application-form"
      onSubmit={form.onSubmit}
      onInput={form.onInput}
      noValidate
    >
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="driver-website">Website</label>
        <input
          id="driver-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="form-grid">
        <div className="field-group field-group--wide">
          <label htmlFor="driverName">Full name</label>
          <input
            id="driverName"
            name="fullName"
            autoComplete="name"
            placeholder="Your full name"
            autoFocus
            aria-invalid={Boolean(form.fieldErrors.fullName)}
            aria-describedby={
              form.fieldErrors.fullName ? "driverName-error" : undefined
            }
          />
          <FieldError
            id="driverName-error"
            message={form.fieldErrors.fullName}
          />
        </div>
        <div className="field-group">
          <label htmlFor="driverEmail">Email</label>
          <input
            id="driverEmail"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(form.fieldErrors.email)}
            aria-describedby={
              form.fieldErrors.email ? "driverEmail-error" : undefined
            }
          />
          <FieldError id="driverEmail-error" message={form.fieldErrors.email} />
        </div>
        <div className="field-group">
          <label htmlFor="driverPhone">Phone or WhatsApp</label>
          <input
            id="driverPhone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+1 876…"
            aria-invalid={Boolean(form.fieldErrors.phone)}
            aria-describedby={
              form.fieldErrors.phone ? "driverPhone-error" : undefined
            }
          />
          <FieldError id="driverPhone-error" message={form.fieldErrors.phone} />
        </div>
        <div className="field-group">
          <label htmlFor="driverLocation">Parish or city</label>
          <input
            id="driverLocation"
            name="location"
            autoComplete="address-level1"
            placeholder="e.g. Kingston"
            aria-invalid={Boolean(form.fieldErrors.location)}
            aria-describedby={
              form.fieldErrors.location ? "driverLocation-error" : undefined
            }
          />
          <FieldError
            id="driverLocation-error"
            message={form.fieldErrors.location}
          />
        </div>
        <div className="field-group">
          <label htmlFor="vehicleType">Vehicle type</label>
          <select
            id="vehicleType"
            name="vehicleType"
            defaultValue=""
            aria-invalid={Boolean(form.fieldErrors.vehicleType)}
            aria-describedby={
              form.fieldErrors.vehicleType ? "vehicleType-error" : undefined
            }
          >
            <option value="" disabled>
              Select one
            </option>
            <option>Motorcycle</option>
            <option>Bicycle</option>
            <option>Car</option>
            <option>Other</option>
          </select>
          <FieldError
            id="vehicleType-error"
            message={form.fieldErrors.vehicleType}
          />
        </div>
        <div className="field-group">
          <label htmlFor="licenceStatus">Driver’s licence status</label>
          <select
            id="licenceStatus"
            name="licenceStatus"
            defaultValue=""
            aria-invalid={Boolean(form.fieldErrors.licenceStatus)}
            aria-describedby={
              form.fieldErrors.licenceStatus
                ? "licenceStatus-error"
                : undefined
            }
          >
            <option value="" disabled>
              Select one
            </option>
            <option>Full licence</option>
            <option>Provisional licence</option>
            <option>Not applicable for my vehicle</option>
            <option>Prefer to discuss</option>
          </select>
          <FieldError
            id="licenceStatus-error"
            message={form.fieldErrors.licenceStatus}
          />
        </div>
        <div className="field-group field-group--wide">
          <label htmlFor="availability">General availability</label>
          <select
            id="availability"
            name="availability"
            defaultValue=""
            aria-invalid={Boolean(form.fieldErrors.availability)}
            aria-describedby={
              form.fieldErrors.availability ? "availability-error" : undefined
            }
          >
            <option value="" disabled>
              Select the best fit
            </option>
            <option>Weekday daytime</option>
            <option>Weekday evenings</option>
            <option>Weekends</option>
            <option>Flexible across the week</option>
            <option>Still deciding</option>
          </select>
          <FieldError
            id="availability-error"
            message={form.fieldErrors.availability}
          />
        </div>
      </div>
      <label className="consent-row" htmlFor="driverConsent">
        <input
          id="driverConsent"
          name="consent"
          type="checkbox"
          aria-invalid={Boolean(form.fieldErrors.consent)}
          aria-describedby={
            form.fieldErrors.consent ? "driverConsent-error" : undefined
          }
        />
        <span className="consent-row__box">
          <Check size={13} />
        </span>
        <span>
          I agree that ONDI may contact me about launch-driver onboarding.
        </span>
      </label>
      <FieldError id="driverConsent-error" message={form.fieldErrors.consent} />
      <FormFeedback status={form.status} message={form.message} />
      <button
        className="button button--form button--form-wide"
        type="submit"
        disabled={form.status === "submitting" || form.status === "success"}
      >
        <span>
          {form.status === "submitting"
            ? "Sending application…"
            : form.status === "success"
              ? "Application received"
              : "Apply for early access"}
        </span>
        {form.status === "success" ? (
          <Check size={18} />
        ) : (
          <ArrowRight size={18} />
        )}
      </button>
      <p className="form-note">
        We won’t ask for ID numbers or document uploads in this first step.
      </p>
    </form>
  );
}

function AppDialog({
  kind,
  onClose,
}: {
  kind: Exclude<ModalKind, null>;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 170);
  };

  const isLegal = kind === "privacy" || kind === "terms";
  const title =
    kind === "restaurant"
      ? "Put your kitchen on Kingston’s first route."
      : kind === "driver"
        ? "Be one of the first to move with ONDI."
        : kind === "privacy"
          ? "Privacy, in plain language."
          : "Launch terms.";

  return (
    <dialog
      className={`app-dialog${closing ? " is-closing" : ""}`}
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      aria-labelledby={`${kind}-dialog-title`}
    >
      <div
        className={`app-dialog__panel${isLegal ? " app-dialog__panel--legal" : ""}`}
      >
        <button
          className="dialog-close"
          type="button"
          onClick={requestClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>
        <div className="dialog-heading">
          <SectionLabel>
            {kind === "restaurant"
              ? "Founding restaurant"
              : kind === "driver"
                ? "Early driver"
                : "Before launch"}
          </SectionLabel>
          <h2 id={`${kind}-dialog-title`}>{title}</h2>
          {!isLegal && (
            <p>
              {kind === "restaurant"
                ? "Share the basics. We’ll follow up with a practical conversation—no commitment required."
                : "Tell us how and when you like to work. Sensitive documents can wait until formal onboarding."}
            </p>
          )}
        </div>
        {kind === "restaurant" && <RestaurantForm />}
        {kind === "driver" && <DriverForm />}
        {kind === "privacy" && (
          <div className="legal-copy">
            <p>
              ONDI collects only the details needed to manage early-access,
              restaurant and driver enquiries. We’ll use them to contact you
              about the launch flow you selected.
            </p>
            <p>
              We do not ask for payment information, government ID numbers or
              document uploads in these forms. A full privacy policy—including
              retention, access and deletion rights—will be published before
              public launch.
            </p>
            <a href="mailto:hello@ondi.app">Questions? hello@ondi.app</a>
          </div>
        )}
        {kind === "terms" && (
          <div className="legal-copy">
            <p>
              Joining a waitlist or applying for launch access does not create
              an employment, delivery or commercial agreement. Final
              eligibility, availability, pricing and partner terms will be
              shared directly before launch.
            </p>
            <p>
              ONDI is currently a pre-launch product. App previews on this site
              show the intended experience and may change as testing continues.
              Full customer, restaurant and driver terms will be available
              before the service opens.
            </p>
            <a href="mailto:hello@ondi.app">Questions? hello@ondi.app</a>
          </div>
        )}
      </div>
    </dialog>
  );
}

export function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [activeFeature, setActiveFeature] =
    useState<FeatureKey>("discover");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  const handleFeatureTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = featureTabs.length - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % featureTabs.length;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex =
        (currentIndex - 1 + featureTabs.length) % featureTabs.length;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    const nextFeature = featureTabs[nextIndex];
    setActiveFeature(nextFeature.id);
    event.currentTarget.parentElement
      ?.querySelector<HTMLButtonElement>(`#feature-tab-${nextFeature.id}`)
      ?.focus();
  };

  useEffect(() => {
    const closeMenu = () => setMobileOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header id="top">
        <div className="announcement">
          <div className="announcement__track" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p>
            <span>LAUNCHING SOON</span>
            <strong>Kingston, Jamaica</strong>
          </p>
          <a href="#launch">
            Get the route update
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>

        <nav className="nav-shell" aria-label="Main navigation">
          <BrandMark />
          <div className="nav-links">
            <a href="#journey">How it moves</a>
            <a href="#restaurants">For restaurants</a>
            <a href="#drivers">Drive with us</a>
          </div>
          <div className="nav-actions">
            <a className="nav-text-link" href="mailto:hello@ondi.app">
              Say hello
            </a>
            <PrimaryLink href="#launch">Join waitlist</PrimaryLink>
          </div>
          <button
            className="mobile-menu-button"
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((current) => !current)}
          >
            <span>Menu</span>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="mobile-menu"
              id="mobile-menu"
              initial={reduceMotion ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
            >
              <div className="mobile-menu__index">ONDI / 01</div>
              <a href="#journey" onClick={() => setMobileOpen(false)}>
                <span>01</span> How it moves
              </a>
              <a href="#restaurants" onClick={() => setMobileOpen(false)}>
                <span>02</span> For restaurants
              </a>
              <a href="#drivers" onClick={() => setMobileOpen(false)}>
                <span>03</span> Drive with us
              </a>
              <PrimaryLink
                href="#launch"
                onClick={() => setMobileOpen(false)}
              >
                Join waitlist
              </PrimaryLink>
              <p>GOOD FOOD. ON DI WAY.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="main">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SectionLabel>Kingston’s next food move</SectionLabel>
            </motion.div>
            <motion.h1
              id="hero-title"
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >
              Cravings have
              <span>
                a new <em>route.</em>
              </span>
            </motion.h1>
            <motion.p
              className="hero-copy__body"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
            >
              Discover Kingston’s good food, order without the runaround, and
              watch every handoff. ONDI is coming soon.
            </motion.p>
            <motion.div
              className="hero-ctas"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
            >
              <PrimaryLink href="#launch">Get early access</PrimaryLink>
              <button
                className="button button--secondary"
                type="button"
                onClick={() => setModal("restaurant")}
              >
                <span>Partner with ONDI</span>
                <Store size={18} />
              </button>
            </motion.div>
            <motion.div
              className="availability"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.38 }}
            >
              <div className="availability__icons" aria-hidden="true">
                <Apple size={18} fill="currentColor" />
                <Smartphone size={18} />
              </div>
              <p>
                <strong>Built for iPhone + Android</strong>
                Download links arrive at launch.
              </p>
            </motion.div>
          </div>

          <div className="hero-visual">
            <HeroPreview />
          </div>

          <div className="hero-side-note" aria-hidden="true">
            <span>SCROLL TO FOLLOW THE ROUTE</span>
            <div />
            <ArrowDown size={15} />
          </div>
        </section>

        <section className="ecosystem-section" aria-labelledby="ecosystem-title">
          <div className="section-heading section-heading--split">
            <Reveal>
              <SectionLabel>The whole food ecosystem</SectionLabel>
              <h2 id="ecosystem-title">
                One good route.
                <span>Three ways to move.</span>
              </h2>
            </Reveal>
            <Reveal className="section-heading__aside" delay={0.1}>
              <p>
                ONDI is being built for every person who gets great food from
                kitchen to doorstep.
              </p>
              <span>01 — 03</span>
            </Reveal>
          </div>

          <div className="ecosystem-layout">
            <Reveal className="audience-customer">
              <div className="audience-customer__copy">
                <span className="audience-number">01 / CUSTOMERS</span>
                <h3>Find your flavour faster.</h3>
                <p>
                  Discover local food, order clearly and follow the handoff in
                  real time.
                </p>
                <div className="mini-feature-row">
                  <span>
                    <Search size={15} /> Discover
                  </span>
                  <span>
                    <ShoppingBag size={15} /> Order
                  </span>
                  <span>
                    <Navigation size={15} /> Track
                  </span>
                </div>
              </div>
              <div className="audience-customer__image">
                <Image
                  src="/ackee-breakfast.jpg"
                  alt="Colourful Jamaican ackee and saltfish breakfast"
                  fill
                  sizes="(max-width: 900px) 100vw, 48vw"
                />
                <div className="image-sticker">
                  <Heart size={17} fill="currentColor" />
                  <span>Save the good stuff</span>
                </div>
              </div>
            </Reveal>

            <Reveal className="audience-restaurant" delay={0.08}>
              <div className="audience-restaurant__top">
                <span className="audience-number">02 / RESTAURANTS</span>
                <Store size={27} />
              </div>
              <h3>Your next regular is already hungry.</h3>
              <p>
                Reach new customers and keep incoming orders simple from first
                tap to kitchen.
              </p>
              <div className="receipt">
                <div className="receipt__top">
                  <span>NEW ORDER</span>
                  <strong>#0187</strong>
                </div>
                <div className="receipt__item">
                  <span>1 × Brown Stew Lunch</span>
                  <CheckCircle2 size={16} />
                </div>
                <div className="receipt__item">
                  <span>1 × Sorrel</span>
                  <CheckCircle2 size={16} />
                </div>
                <div className="receipt__footer">
                  <span>Ready to accept</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Reveal>

            <Reveal className="audience-driver" delay={0.14}>
              <div className="audience-driver__route" aria-hidden="true">
                <span />
                <span />
                <span />
                <MapPin size={24} fill="currentColor" />
              </div>
              <div className="audience-driver__icon">
                <Bike size={34} />
              </div>
              <div className="audience-driver__copy">
                <span className="audience-number">03 / DRIVERS</span>
                <h3>Work the hours that work for you.</h3>
                <p>
                  See the delivery details up front, move locally and get
                  support during onboarding.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal("driver")}
                aria-label="Apply to drive with ONDI"
              >
                <ArrowRight size={22} />
              </button>
            </Reveal>
          </div>
        </section>

        <section
          className="journey-section"
          id="journey"
          aria-labelledby="journey-title"
        >
          <div className="journey-heading">
            <Reveal>
              <SectionLabel light>Customer journey</SectionLabel>
              <h2 id="journey-title">
                From “what should we eat?”
                <span>to doorbell.</span>
              </h2>
            </Reveal>
            <Reveal className="journey-heading__note" delay={0.1}>
              <Route size={24} aria-hidden="true" />
              <p>Four clear moves. No mystery in the middle.</p>
            </Reveal>
          </div>

          <div className="journey-route" aria-hidden="true">
            <span className="journey-route__base" />
            <motion.span
              className="journey-route__progress"
              initial={reduceMotion ? false : { scaleX: 0 }}
              whileInView={reduceMotion ? undefined : { scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="journey-steps">
            {[
              {
                number: "01",
                title: "Discover",
                copy: "Browse by mood, dish, distance or the local spot you already love.",
                icon: Search,
              },
              {
                number: "02",
                title: "Order",
                copy: "See the details, shape your meal and check out with confidence.",
                icon: ShoppingBag,
              },
              {
                number: "03",
                title: "Track",
                copy: "Follow confirmation, pickup and the route to your door.",
                icon: Navigation,
              },
              {
                number: "04",
                title: "Enjoy",
                copy: "Open the bag. Take the first bite. Save the place for next time.",
                icon: UtensilsCrossed,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal
                  className="journey-step"
                  delay={index * 0.08}
                  key={step.title}
                >
                  <div className="journey-step__marker">
                    <Icon size={21} />
                  </div>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section
          className="showcase-section"
          id="app"
          aria-labelledby="showcase-title"
        >
          <div className="section-heading section-heading--split">
            <Reveal>
              <SectionLabel>Inside the app</SectionLabel>
              <h2 id="showcase-title">
                The app is
                <span>the appetite.</span>
              </h2>
            </Reveal>
            <Reveal className="section-heading__aside" delay={0.1}>
              <p>
                A coherent first look at discovery, favourites, food details,
                your cart, secure checkout and the live route.
              </p>
              <span>PRODUCT PREVIEW</span>
            </Reveal>
          </div>

          <div className="showcase-stage">
            <div
              className="feature-tabs"
              role="tablist"
              aria-label="ONDI app features"
            >
              {featureTabs.map((feature, index) => {
                const Icon = feature.icon;
                const active = feature.id === activeFeature;
                return (
                  <button
                    key={feature.id}
                    id={`feature-tab-${feature.id}`}
                    className={active ? "is-active" : ""}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="feature-panel"
                    tabIndex={active ? 0 : -1}
                    onClick={() => setActiveFeature(feature.id)}
                    onKeyDown={(event) =>
                      handleFeatureTabKeyDown(event, index)
                    }
                  >
                    <span className="feature-tabs__icon">
                      <Icon size={19} />
                    </span>
                    <span className="feature-tabs__copy">
                      <strong>{feature.label}</strong>
                      <small>{feature.note}</small>
                    </span>
                    <ArrowRight size={17} />
                  </button>
                );
              })}
            </div>

            <Reveal className="showcase-device">
              <div className="showcase-device__route" aria-hidden="true">
                <span />
                <MapPin size={25} fill="currentColor" />
              </div>
              <div className="showcase-phone">
                <div className="showcase-phone__speaker" />
                <div
                  id="feature-panel"
                  role="tabpanel"
                  aria-labelledby={`feature-tab-${activeFeature}`}
                >
                  <p className="sr-only">
                    {featureTabs.find((item) => item.id === activeFeature)
                      ?.label}{" "}
                    preview:{" "}
                    {featureTabs.find((item) => item.id === activeFeature)
                      ?.note}
                    .
                  </p>
                  <FeatureScreen active={activeFeature} />
                </div>
              </div>
              <div className="showcase-callout showcase-callout--one">
                <ShieldCheck size={18} />
                <span>
                  <strong>Secure by design</strong>
                  Protected checkout
                </span>
              </div>
              <div className="showcase-callout showcase-callout--two">
                <Heart size={18} fill="currentColor" />
                <span>
                  <strong>Keep your favourites</strong>
                  One tap back to good
                </span>
              </div>
            </Reveal>

            <div className="showcase-index" aria-hidden="true">
              <span>ONDI APP</span>
              <strong>
                0{featureTabs.findIndex((item) => item.id === activeFeature) + 1}
                /04
              </strong>
            </div>
          </div>
        </section>

        <section
          className="restaurant-section"
          id="restaurants"
          aria-labelledby="restaurant-title"
        >
          <div className="restaurant-copy">
            <Reveal>
              <SectionLabel>For restaurants</SectionLabel>
              <h2 id="restaurant-title">
                More orders.
                <span>Less noise.</span>
              </h2>
              <p className="restaurant-copy__lead">
                Join the first group shaping how Kingston orders. ONDI is being
                built to give kitchens reach without adding chaos to service.
              </p>
            </Reveal>

            <Reveal className="benefit-list" delay={0.08}>
              {[
                ["01", "More digital reach", "Meet customers beyond your usual radius."],
                ["02", "Simple order flow", "Clear incoming orders and handoff status."],
                ["03", "Founding visibility", "A launch spotlight while the network is new."],
                ["04", "Operational insight", "Practical signals to improve the menu flow."],
                ["05", "Delivery support", "Optional support where your setup needs it."],
              ].map(([number, title, copy]) => (
                <div className="benefit-list__item" key={number}>
                  <span>{number}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{copy}</p>
                  </div>
                  <Check size={17} />
                </div>
              ))}
            </Reveal>

            <Reveal className="restaurant-cta-row" delay={0.12}>
              <button
                className="button button--dark"
                type="button"
                onClick={() => setModal("restaurant")}
              >
                <span>Become a founding restaurant</span>
                <ArrowRight size={18} />
              </button>
              <p>
                <Sparkles size={16} /> Applications are open for Kingston.
              </p>
            </Reveal>
          </div>

          <Reveal className="restaurant-visual" delay={0.1}>
            <div className="restaurant-visual__index">KITCHEN / 01</div>
            <div className="dashboard-shell">
              <div className="dashboard-top">
                <BrandMark />
                <div>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="dashboard-body">
                <aside>
                  <span className="is-active">
                    <ReceiptText size={16} /> Orders
                  </span>
                  <span>
                    <UtensilsCrossed size={16} /> Menu
                  </span>
                  <span>
                    <BarChart3 size={16} /> Insights
                  </span>
                </aside>
                <div className="dashboard-main">
                  <div className="dashboard-heading">
                    <div>
                      <span>FRIDAY SERVICE</span>
                      <h3>Orders</h3>
                    </div>
                    <span className="store-status">Open for orders</span>
                  </div>
                  <div className="order-columns">
                    <div>
                      <span className="order-columns__title">NEW · 2</span>
                      <article className="kitchen-order kitchen-order--hot">
                        <div>
                          <span>#0187</span>
                          <Clock3 size={14} />
                        </div>
                        <strong>2 items</strong>
                        <p>Brown Stew Lunch<br />Sorrel</p>
                        <span className="kitchen-order__action">
                          Accept order
                        </span>
                      </article>
                    </div>
                    <div>
                      <span className="order-columns__title">COOKING · 1</span>
                      <article className="kitchen-order">
                        <div>
                          <span>#0184</span>
                          <ChefHat size={14} />
                        </div>
                        <strong>1 item</strong>
                        <p>Ackee Morning Box</p>
                        <div className="order-ready">
                          <span />
                          In the kitchen
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="restaurant-visual__ticket">
              <span>FOUNDING PARTNER</span>
              <strong>Get seen from day one.</strong>
              <ArrowRight size={18} />
            </div>
          </Reveal>
        </section>

        <section
          className="driver-section"
          id="drivers"
          aria-labelledby="driver-title"
        >
          <div className="driver-route-bg" aria-hidden="true">
            <span className="driver-route-bg__one" />
            <span className="driver-route-bg__two" />
            <span className="driver-route-bg__three" />
            <span className="driver-route-bg__pin">
              <MapPin size={39} fill="currentColor" />
            </span>
          </div>

          <Reveal className="driver-copy">
            <SectionLabel light>Drive with ONDI</SectionLabel>
            <h2 id="driver-title">
              Your road.
              <span>Your rhythm.</span>
            </h2>
            <p>
              Choose when you’re available, see clear delivery information and
              move with support from the first onboarding step.
            </p>
            <div className="driver-vehicles" aria-label="Accepted vehicle types">
              <span>
                <Bike size={17} /> Motorcycle
              </span>
              <span>
                <Bike size={17} /> Bicycle
              </span>
              <span>
                <CarFront size={17} /> Car
              </span>
              <span>
                <Zap size={17} /> Other
              </span>
            </div>
            <button
              className="button button--lime"
              type="button"
              onClick={() => setModal("driver")}
            >
              <span>Apply for early access</span>
              <ArrowRight size={18} />
            </button>
          </Reveal>

          <Reveal className="driver-benefits" delay={0.1}>
            {[
              {
                icon: Clock3,
                title: "Flexible work",
                copy: "Share the availability that fits your week.",
              },
              {
                icon: Navigation,
                title: "Clear delivery info",
                copy: "Know the pickup and route before the handoff.",
              },
              {
                icon: MapPin,
                title: "Local opportunity",
                copy: "Move within the launch areas you know.",
              },
              {
                icon: PackageCheck,
                title: "Early launch access",
                copy: "Help shape the driver experience before release.",
              },
              {
                icon: Headphones,
                title: "Onboarding support",
                copy: "Get practical help while you learn the flow.",
              },
            ].map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div className="driver-benefit" key={benefit.title}>
                  <div>
                    <Icon size={20} />
                  </div>
                  <strong>{benefit.title}</strong>
                  <p>{benefit.copy}</p>
                </div>
              );
            })}
          </Reveal>
        </section>

        <section
          className="launch-section"
          id="launch"
          aria-labelledby="launch-title"
        >
          <div className="launch-grid">
            <Reveal className="launch-copy">
              <SectionLabel>Coming soon</SectionLabel>
              <h2 id="launch-title">
                Kingston is
                <span>stop one.</span>
              </h2>
              <p>
                The route is taking shape. Join now for build updates, early
                testing invitations and the first launch notice.
              </p>
              <div className="launch-stamp" aria-hidden="true">
                <span>ON DI WAY</span>
                <MapPin size={28} fill="currentColor" />
              </div>
            </Reveal>

            <Reveal className="launch-roadmap" delay={0.08}>
              <div className="roadmap-title">
                <span>LAUNCH ROUTE</span>
                <strong>Kingston / Jamaica</strong>
              </div>
              <ol>
                <li className="is-current">
                  <span>01</span>
                  <div>
                    <strong>Building the network</strong>
                    <p>Founding restaurants and drivers</p>
                  </div>
                  <small>NOW</small>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <strong>Invite-only testing</strong>
                    <p>Small customer groups</p>
                  </div>
                  <small>NEXT</small>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <strong>Kingston opens</strong>
                    <p>Public app release</p>
                  </div>
                  <small>LAUNCH</small>
                </li>
              </ol>
            </Reveal>
          </div>

          <Reveal className="launch-form-panel" delay={0.12}>
            <div>
              <span>GET THE FIRST DROP</span>
              <h3>Tell us where to find you.</h3>
            </div>
            <CustomerWaitlistForm />
          </Reveal>
        </section>

        <section className="faq-section" aria-labelledby="faq-title">
          <div className="faq-heading">
            <Reveal>
              <SectionLabel>Good questions</SectionLabel>
              <h2 id="faq-title">
                Before the
                <span>first order.</span>
              </h2>
            </Reveal>
            <Reveal className="faq-heading__contact" delay={0.1}>
              <p>Still wondering about something?</p>
              <a href="mailto:hello@ondi.app">
                hello@ondi.app <ArrowRight size={16} />
              </a>
            </Reveal>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              const answerId = `faq-answer-${index}`;
              return (
                <Reveal
                  className={`faq-item${isOpen ? " is-open" : ""}`}
                  delay={Math.min(index * 0.03, 0.18)}
                  key={faq.question}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{faq.question}</strong>
                    <span className="faq-item__toggle">
                      <ChevronDown size={21} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={answerId}
                        className="faq-answer"
                        initial={
                          reduceMotion ? false : { height: 0, opacity: 0 }
                        }
                        animate={{ height: "auto", opacity: 1 }}
                        exit={
                          reduceMotion ? undefined : { height: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.28 }}
                      >
                        <p>{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="closing-section" aria-labelledby="closing-title">
          <div className="closing-route" aria-hidden="true">
            <span />
            <span />
            <MapPin size={40} fill="currentColor" />
          </div>
          <Reveal>
            <SectionLabel light>Kingston, this one is ours</SectionLabel>
            <h2 id="closing-title">
              Let’s move food
              <span>forward.</span>
            </h2>
          </Reveal>
          <Reveal className="closing-actions" delay={0.1}>
            <PrimaryLink href="#launch" inverse>
              Join the launch list
            </PrimaryLink>
            <button
              type="button"
              onClick={() => setModal("restaurant")}
            >
              Restaurant signup <ArrowRight size={17} />
            </button>
            <button type="button" onClick={() => setModal("driver")}>
              Driver signup <ArrowRight size={17} />
            </button>
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <BrandMark inverse />
            <p>GOOD FOOD. ON DI WAY.</p>
            <span>Launching first in Kingston, Jamaica.</span>
          </div>
          <div className="footer-column">
            <span>MOVE AROUND</span>
            <a href="#journey">How it moves</a>
            <a href="#app">App preview</a>
            <a href="#restaurants">For restaurants</a>
            <a href="#drivers">Drive with us</a>
          </div>
          <div className="footer-column">
            <span>CONTACT</span>
            <a href="mailto:hello@ondi.app">hello@ondi.app</a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a href="https://x.com/" target="_blank" rel="noreferrer">
              X / Twitter
            </a>
          </div>
          <div className="footer-signoff" aria-hidden="true">
            <span>MADE FOR</span>
            <strong>KNG</strong>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ONDI. All routes reserved.</span>
          <div>
            <button type="button" onClick={() => setModal("privacy")}>
              Privacy
            </button>
            <button type="button" onClick={() => setModal("terms")}>
              Terms
            </button>
          </div>
          <span>PRE-LAUNCH / JAMAICA</span>
        </div>
      </footer>

      {modal && <AppDialog kind={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
