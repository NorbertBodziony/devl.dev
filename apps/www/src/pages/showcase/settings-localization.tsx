// @ts-nocheck
import { createMemo, createSignal } from "solid-js";
import { CheckIcon, ClockIcon, GlobeIcon, HashIcon, LanguagesIcon, SearchIcon, CalendarDaysIcon, CoinsIcon, CalendarRangeIcon, } from "lucide-solid";
import { Autocomplete, AutocompleteEmpty, AutocompleteGroup, AutocompleteGroupLabel, AutocompleteInput, AutocompleteItem, AutocompleteList, AutocompletePopup, } from "@orbit/ui/autocomplete";
import { RadioGroup, Radio } from "@orbit/ui/radio-group";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue, } from "@orbit/ui/select";
import { Separator } from "@orbit/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@orbit/ui/toggle-group";
import { SettingsField, SettingsSection } from "./_components/settings-layout";
type FirstDay = "sun" | "mon" | "sat";
type TimeFormat = "h12" | "h24";
type DateFormatId = "mdy-slash" | "dmy-slash" | "iso" | "med";
type NumberFormatId = "us" | "eu" | "fr";
const LANGUAGES: {
    value: string;
    flag: string;
    label: string;
    bcp47: string;
}[] = [
    { value: "en-US", flag: "🇺🇸", label: "English (US)", bcp47: "en-US" },
    { value: "en-GB", flag: "🇬🇧", label: "English (UK)", bcp47: "en-GB" },
    { value: "fr-FR", flag: "🇫🇷", label: "Français", bcp47: "fr-FR" },
    { value: "de-DE", flag: "🇩🇪", label: "Deutsch", bcp47: "de-DE" },
    { value: "ja-JP", flag: "🇯🇵", label: "日本語", bcp47: "ja-JP" },
    { value: "zh-CN", flag: "🇨🇳", label: "中文 简体", bcp47: "zh-CN" },
    { value: "es-ES", flag: "🇪🇸", label: "Español", bcp47: "es-ES" },
    { value: "pt-BR", flag: "🇧🇷", label: "Português Brasil", bcp47: "pt-BR" },
];
type TimezoneItem = {
    value: string;
    label: string;
    region: "Americas" | "Europe" | "Asia" | "Pacific";
};
const TIMEZONES: TimezoneItem[] = [
    { value: "America/Los_Angeles", label: "Los Angeles (PT)", region: "Americas" },
    { value: "America/Denver", label: "Denver (MT)", region: "Americas" },
    { value: "America/Chicago", label: "Chicago (CT)", region: "Americas" },
    { value: "America/New_York", label: "New York (ET)", region: "Americas" },
    { value: "America/Sao_Paulo", label: "São Paulo (BRT)", region: "Americas" },
    { value: "Europe/London", label: "London (GMT)", region: "Europe" },
    { value: "Europe/Paris", label: "Paris (CET)", region: "Europe" },
    { value: "Europe/Berlin", label: "Berlin (CET)", region: "Europe" },
    { value: "Europe/Madrid", label: "Madrid (CET)", region: "Europe" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)", region: "Asia" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)", region: "Asia" },
    { value: "Asia/Singapore", label: "Singapore (SGT)", region: "Asia" },
    { value: "Asia/Kolkata", label: "Mumbai (IST)", region: "Asia" },
    { value: "Australia/Sydney", label: "Sydney (AEDT)", region: "Pacific" },
    { value: "Pacific/Auckland", label: "Auckland (NZDT)", region: "Pacific" },
    { value: "Pacific/Honolulu", label: "Honolulu (HST)", region: "Pacific" },
];
const CURRENCIES: {
    value: string;
    label: string;
    symbol: string;
}[] = [
    { value: "USD", label: "USD — US Dollar", symbol: "$" },
    { value: "EUR", label: "EUR — Euro", symbol: "€" },
    { value: "GBP", label: "GBP — British Pound", symbol: "£" },
    { value: "JPY", label: "JPY — Japanese Yen", symbol: "¥" },
    { value: "CAD", label: "CAD — Canadian Dollar", symbol: "$" },
    { value: "AUD", label: "AUD — Australian Dollar", symbol: "$" },
];
const DATE_FORMATS: {
    id: DateFormatId;
    label: string;
    example: string;
    hint: string;
}[] = [
    { id: "mdy-slash", label: "MM/DD/YYYY", example: "12/31/2025", hint: "US" },
    { id: "dmy-slash", label: "DD/MM/YYYY", example: "31/12/2025", hint: "EU" },
    { id: "iso", label: "YYYY-MM-DD", example: "2025-12-31", hint: "ISO 8601" },
    { id: "med", label: "MMM D, YYYY", example: "Dec 31, 2025", hint: "Long" },
];
const NUMBER_FORMATS: {
    id: NumberFormatId;
    example: string;
    locale: string;
    hint: string;
}[] = [
    { id: "us", example: "1,234.56", locale: "en-US", hint: "US / UK" },
    { id: "eu", example: "1.234,56", locale: "de-DE", hint: "DE / ES" },
    { id: "fr", example: "1 234,56", locale: "fr-FR", hint: "FR / SE" },
];
export function SettingsLocalizationShowcasePage() {
    const [language, setLanguage] = createSignal("en-US");
    const [timezone, setTimezone] = createSignal("America/Los_Angeles");
    const [firstDay, setFirstDay] = createSignal<FirstDay>("sun");
    const [dateFormat, setDateFormat] = createSignal<DateFormatId>("mdy-slash");
    const [timeFormat, setTimeFormat] = createSignal<TimeFormat>("h12");
    const [currency, setCurrency] = createSignal("USD");
    const [numberFormat, setNumberFormat] = createSignal<NumberFormatId>("us");
    const previewDate = createMemo(() => new Date(), []);
    const formattedDate = createMemo(() => formatDate(previewDate(), dateFormat(), timezone()), [previewDate(), dateFormat(), timezone()]);
    const formattedTime = createMemo(() => formatTime(previewDate(), timeFormat(), language(), timezone()), [previewDate(), timeFormat(), language(), timezone()]);
    const formattedNumber = createMemo(() => {
        const locale = NUMBER_FORMATS.find((n) => n.id === numberFormat())?.locale;
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(1234567.89);
    }, [numberFormat()]);
    const formattedCurrency = createMemo(() => {
        const locale = NUMBER_FORMATS.find((n) => n.id === numberFormat())?.locale;
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency(),
            currencyDisplay: "narrowSymbol",
        }).format(99999);
    }, [numberFormat(), currency()]);
    const formattedRelative = createMemo(() => {
        try {
            const rtf = new Intl.RelativeTimeFormat(language(), { numeric: "auto" });
            return rtf.format(-2, "hour");
        }
        catch {
            return "2 hours ago";
        }
    }, [language()]);
    const week = createMemo(() => buildWeek(previewDate(), firstDay(), language()), [
        previewDate(),
        firstDay(),
        language(),
    ]);
    const tzItem = TIMEZONES.find((t) => t.value === timezone());
    return (<div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 sm:py-14">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          Account · Localization
        </div>
        <h1 className="mt-1 font-heading text-3xl">Localization</h1>
        <p className="mt-1.5 max-w-xl text-muted-foreground text-sm">
          Pick how dates, times, numbers, and currencies are shown to you across the app. Changes apply immediately and only affect your account.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* LEFT COLUMN — FORM */}
          <div className="flex flex-col">
            <SettingsSection title="Language" icon={<LanguagesIcon className="size-4"/>} hint="The language used across menus, emails, and notifications." contentClass="mt-4 flex flex-col gap-5">
              <SettingsField label="Display language" htmlFor="loc-lang" className="gap-2">
                <Select value={language()} onValueChange={(v) => v && setLanguage(v)}>
                  <SelectTrigger id="loc-lang" className="w-full">
                    <SelectValue>
                      {(() => {
            const l = LANGUAGES.find((x) => x.value === language());
            return l ? (<span className="flex items-center gap-2">
                            <span aria-hidden className="text-base">
                              {l.flag}
                            </span>
                            <span>{l.label}</span>
                          </span>) : null;
        })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectPopup>
                    {LANGUAGES.map((l) => (<SelectItem key={l.value} value={l.value}>
                        <span className="flex items-center gap-2">
                          <span aria-hidden className="text-base">
                            {l.flag}
                          </span>
                          <span>{l.label}</span>
                          <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                            {l.bcp47}
                          </span>
                        </span>
                      </SelectItem>))}
                  </SelectPopup>
                </Select>
              </SettingsField>
            </SettingsSection>

            <Separator className="my-8"/>

            <SettingsSection title="Time & region" icon={<GlobeIcon className="size-4"/>} hint="Used for times, dates, and the calendar grid." contentClass="mt-4 flex flex-col gap-5">
              <SettingsField label="Timezone" htmlFor="loc-tz" hint="Search any city or region." className="gap-2">
                <TimezoneAutocomplete value={timezone()} label={tzItem?.label ?? timezone()} onChange={setTimezone}/>
              </SettingsField>

              <SettingsField label="First day of week" htmlFor="loc-first" className="gap-2">
                <ToggleGroup value={[firstDay()]} onValueChange={(v) => {
            const next = (v as string[])[0];
            if (next === "sun" || next === "mon" || next === "sat") {
                setFirstDay(next);
            }
                }} variant="outline" aria-label="First day of week">
                  <ToggleGroupItem value="sun">Sunday</ToggleGroupItem>
                  <ToggleGroupItem value="mon">Monday</ToggleGroupItem>
                  <ToggleGroupItem value="sat">Saturday</ToggleGroupItem>
                </ToggleGroup>
              </SettingsField>

              <SettingsField label="Date format" className="gap-2">
                <RadioGroup value={dateFormat()} onValueChange={(v) => v && setDateFormat(v as DateFormatId)} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {DATE_FORMATS.map((d) => {
            const checked = dateFormat() === d.id;
            return (<label key={d.id} className={`group relative flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${checked
                    ? "border-ring bg-accent/40"
                    : "border-border/60 hover:bg-foreground/[0.03]"}`}>
                        <Radio value={d.id} className="mt-0.5"/>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-mono text-sm">
                              {d.example}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                              {d.hint}
                            </span>
                          </div>
                          <p className="mt-0.5 text-muted-foreground text-xs">
                            {d.label}
                          </p>
                        </div>
                      </label>);
        })}
                </RadioGroup>
              </SettingsField>

              <SettingsField label="Time format" className="gap-2">
                <div className="grid grid-cols-2 gap-2">
                  {(["h12", "h24"] as const).map((id) => {
            const checked = timeFormat() === id;
            const example = formatTime(previewDate(), id, language(), timezone());
            return (<button type="button" key={id} onClick={() => setTimeFormat(id)} className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors ${checked
                    ? "border-ring bg-accent/40"
                    : "border-border/60 hover:bg-foreground/[0.03]"}`}>
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="font-medium text-sm">
                            {id === "h12" ? "12-hour" : "24-hour"}
                          </span>
                          {checked ? (<CheckIcon className="size-3.5 text-primary"/>) : null}
                        </div>
                        <span className="font-mono text-muted-foreground text-xs">
                          {example}
                        </span>
                      </button>);
        })}
                </div>
              </SettingsField>
            </SettingsSection>

            <Separator className="my-8"/>

            <SettingsSection title="Numbers & currency" icon={<HashIcon className="size-4"/>} hint="How numeric values are grouped, separated, and prefixed." contentClass="mt-4 flex flex-col gap-5">
              <SettingsField label="Currency" htmlFor="loc-currency" className="gap-2">
                <Select value={currency()} onValueChange={(v) => v && setCurrency(v)}>
                  <SelectTrigger id="loc-currency" className="w-full">
                    <SelectValue>
                      {(() => {
            const c = CURRENCIES.find((x) => x.value === currency());
            return c ? (<span className="flex items-center gap-2">
                            <span className="inline-flex size-5 items-center justify-center rounded bg-foreground/[0.06] font-mono text-xs">
                              {c.symbol}
                            </span>
                            <span>{c.label}</span>
                          </span>) : null;
        })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectPopup>
                    {CURRENCIES.map((c) => (<SelectItem key={c.value} value={c.value}>
                        <span className="flex items-center gap-2">
                          <span className="inline-flex size-5 items-center justify-center rounded bg-foreground/[0.06] font-mono text-xs">
                            {c.symbol}
                          </span>
                          <span>{c.label}</span>
                        </span>
                      </SelectItem>))}
                  </SelectPopup>
                </Select>
              </SettingsField>

              <SettingsField label="Number format" className="gap-2">
                <RadioGroup value={numberFormat()} onValueChange={(v) => v && setNumberFormat(v as NumberFormatId)} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {NUMBER_FORMATS.map((n) => {
            const checked = numberFormat() === n.id;
            return (<label key={n.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${checked
                    ? "border-ring bg-accent/40"
                    : "border-border/60 hover:bg-foreground/[0.03]"}`}>
                        <Radio value={n.id} className="mt-0.5"/>
                        <div className="min-w-0 flex-1">
                          <div className="font-mono text-sm">{n.example}</div>
                          <div className="mt-0.5 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                            {n.hint}
                          </div>
                        </div>
                      </label>);
        })}
                </RadioGroup>
              </SettingsField>
            </SettingsSection>
          </div>

          {/* RIGHT COLUMN — PREVIEW */}
          <aside className="lg:sticky lg:top-12 lg:self-start">
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
                    Today's preview
                  </div>
                  <div className="mt-1 font-heading text-base">
                    Live formatting
                  </div>
                </div>
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-foreground/[0.06]">
                  <GlobeIcon className="size-4 opacity-70"/>
                </span>
              </div>

              <Separator className="my-4"/>

              <dl className="flex flex-col divide-y divide-border/50">
                <PreviewRow icon={<CalendarDaysIcon className="size-3.5"/>} label="Date" value={formattedDate()}/>
                <PreviewRow icon={<ClockIcon className="size-3.5"/>} label="Time" value={formattedTime()}/>
                <PreviewRow icon={<HashIcon className="size-3.5"/>} label="Number" value={formattedNumber()}/>
                <PreviewRow icon={<CoinsIcon className="size-3.5"/>} label="Currency" value={formattedCurrency()}/>
                <PreviewRow icon={<CalendarRangeIcon className="size-3.5"/>} label="Relative" value={formattedRelative()}/>
              </dl>

              <Separator className="my-4"/>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
                    Calendar
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Week starts {firstDayLabel(firstDay())}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-7 gap-1.5">
                  {week().map((d) => (<div key={d.iso} className={`flex flex-col items-center gap-1 rounded-md border px-1 py-1.5 text-center ${d.isToday
                ? "border-ring bg-accent/40"
                : "border-border/50 bg-background/40"}`}>
                      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                        {d.weekday}
                      </span>
                      <span className={`font-medium text-sm ${d.isToday ? "text-foreground" : "text-foreground/80"}`}>
                        {d.day}
                      </span>
                    </div>))}
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-foreground/[0.04] p-3">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Preview uses{" "}
                  <span className="font-mono text-[11px]">
                    Intl.DateTimeFormat
                  </span>{" "}
                  and{" "}
                  <span className="font-mono text-[11px]">
                    Intl.NumberFormat
                  </span>{" "}
                  for{" "}
                  <span className="font-medium text-foreground">{language()}</span>
                  .
                </p>
              </div>
            </div>

            <p className="mt-3 px-1 text-muted-foreground text-xs">
              Tip: relative time strings translate automatically when supported by your browser.
            </p>
          </aside>
        </div>
      </div>
    </div>);
}
// -- Helpers --------------------------------------------------------------
function PreviewRow({ icon, label, value, }: {
    icon: JSX.Element;
    label: string;
    value: string;
}) {
    return (<div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="flex items-center gap-2 text-muted-foreground text-xs">
        <span className="inline-flex size-5 items-center justify-center rounded bg-foreground/[0.05] text-foreground/70">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="truncate font-mono text-foreground text-sm">{value}</dd>
    </div>);
}
function TimezoneAutocomplete({ value, label, onChange, }: {
    value: string;
    label: string;
    onChange: (v: string) => void;
}) {
    const [text, setText] = createSignal(label);
    const filtered = createMemo(() => {
        const q = text().trim().toLowerCase();
        if (!q || q === label.toLowerCase())
            return TIMEZONES;
        return TIMEZONES.filter((t) => t.label.toLowerCase().includes(q) ||
            t.value.toLowerCase().includes(q) ||
            t.region.toLowerCase().includes(q));
    }, [text(), label]);
    const grouped = createMemo(() => {
        const groups: Record<TimezoneItem["region"], TimezoneItem[]> = {
            Americas: [],
            Europe: [],
            Asia: [],
            Pacific: [],
        };
        for (const tz of filtered())
            groups[tz.region].push(tz);
        return groups;
    }, [filtered()]);
    return (<Autocomplete value={text()} onValueChange={setText} onItemHighlighted={() => {
            // no-op; we wire selection through onValueChange below via items
        }} onOpenChange={(open) => {
            if (!open) {
                // restore the label of the current value if user typed something then closed
                const hit = TIMEZONES.find((t) => t.label.toLowerCase() === text().trim().toLowerCase());
                if (!hit)
                    setText(label);
            }
        }}>
      <AutocompleteInput id="loc-tz" placeholder="Search a city or region…" startAddon={<SearchIcon />} showClear/>
      <AutocompletePopup className="w-(--anchor-width)">
        <AutocompleteList>
          <AutocompleteEmpty>No timezones match.</AutocompleteEmpty>
          {(Object.keys(grouped()) as TimezoneItem["region"][]).map((region) => {
            const items = grouped()[region];
            if (items.length === 0)
                return null;
            return (<AutocompleteGroup key={region}>
                <AutocompleteGroupLabel>{region}</AutocompleteGroupLabel>
                {items.map((tz) => (<AutocompleteItem key={tz.value} value={tz.label} onClick={() => {
                        onChange(tz.value);
                        setText(tz.label);
                    }}>
                    <span className="flex w-full items-center gap-2">
                      <span className="flex-1 truncate">{tz.label}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {tz.value}
                      </span>
                      {tz.value === value ? (<CheckIcon className="size-3.5 text-primary"/>) : null}
                    </span>
                  </AutocompleteItem>))}
              </AutocompleteGroup>);
        })}
        </AutocompleteList>
      </AutocompletePopup>
    </Autocomplete>);
}
function formatDate(date: Date, id: DateFormatId, timezone: string): string {
    switch (id) {
        case "iso": {
            const parts = new Intl.DateTimeFormat("en-CA", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                timeZone: timezone,
            }).format(date);
            return parts;
        }
        case "med":
            return new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                timeZone: timezone,
            }).format(date);
        case "dmy-slash":
            return new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                timeZone: timezone,
            }).format(date);
        case "mdy-slash":
        default:
            return new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                timeZone: timezone,
            }).format(date);
    }
}
function formatTime(date: Date, format: TimeFormat, language: string, timezone: string): string {
    return new Intl.DateTimeFormat(language, {
        hour: "numeric",
        minute: "2-digit",
        hour12: format === "h12",
        timeZone: timezone,
    }).format(date);
}
function buildWeek(today: Date, firstDay: FirstDay, language: string) {
    const startMap: Record<FirstDay, number> = { sun: 0, mon: 1, sat: 6 };
    const desiredStart = startMap[firstDay];
    const todayDow = today.getDay();
    const offset = (todayDow - desiredStart + 7) % 7;
    const start = new Date(today);
    start.setDate(today.getDate() - offset);
    const days: {
        iso: string;
        weekday: string;
        day: number;
        isToday: boolean;
    }[] = [];
    const wdFmt = new Intl.DateTimeFormat(language, { weekday: "short" });
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push({
            iso: d.toISOString().slice(0, 10),
            weekday: wdFmt.format(d),
            day: d.getDate(),
            isToday: d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth() &&
                d.getDate() === today.getDate(),
        });
    }
    return days;
}
function firstDayLabel(d: FirstDay): string {
    return d === "sun" ? "Sunday" : d === "mon" ? "Monday" : "Saturday";
}
