// @ts-nocheck
import { createSignal } from "solid-js";
import { AtSignIcon, GlobeIcon, KeyRoundIcon, ShieldCheckIcon, TrashIcon, UploadIcon, } from "lucide-solid";
import { Button } from "@orbit/ui/button";
import { Input } from "@orbit/ui/input";
import { Separator } from "@orbit/ui/separator";
import { Textarea } from "@orbit/ui/textarea";
import { NativeSelect, SettingsField, SettingsSection } from "./_components/settings-layout";
import { Eyebrow, Heading, Text } from "@orbit/ui/typography";
export function SettingsProfileShowcasePage() {
    const [dirty, setDirty] = createSignal(false);
    return (<div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-8 py-12 pb-32">
        <Eyebrow>
          Account · Profile
        </Eyebrow>
        <Heading as="h1" size="xl" className="mt-1 tracking-normal">Your profile</Heading>
        <Text tone="muted" size="sm" className="mt-1.5">
          How you appear across every workspace you belong to.
        </Text>

        <SettingsSection title="Photo" className="mt-8">
          <div className="flex items-center gap-5">
            <div className="size-20 shrink-0 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 ring-1 ring-border/60"/>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" type="button">
                  <UploadIcon />
                  Upload
                </Button>
                <Button size="sm" variant="ghost" type="button">
                  Remove
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Recommended: 400×400 PNG, JPG, or SVG.
              </p>
            </div>
          </div>
        </SettingsSection>

        <Separator className="my-8"/>

        <SettingsSection title="Identity" className="mt-8">
          <SettingsField label="Display name" htmlFor="p-name">
            <Input id="p-name" defaultValue="Sean Brydon" onChange={() => setDirty(true)} nativeInput/>
          </SettingsField>
          <SettingsField label="Handle" htmlFor="p-handle">
            <div className="flex h-9 items-center gap-1 rounded-lg border border-input bg-background px-3 font-mono text-sm focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/24">
              <AtSignIcon className="size-3.5 opacity-60"/>
              <input id="p-handle" defaultValue="seancassiere" onInput={() => setDirty(true)} className="flex-1 bg-transparent outline-none"/>
            </div>
          </SettingsField>
          <SettingsField label="Pronouns" htmlFor="p-pron">
            <Input id="p-pron" placeholder="e.g. they / them" onChange={() => setDirty(true)} nativeInput/>
          </SettingsField>
          <SettingsField label="Bio" htmlFor="p-bio" hint="Up to 240 characters.">
            <Textarea id="p-bio" rows={3} placeholder="Designer, engineer, generally indoors." onChange={() => setDirty(true)}/>
          </SettingsField>
        </SettingsSection>

        <Separator className="my-8"/>

        <SettingsSection title="Locale" className="mt-8">
          <SettingsField label="Email" htmlFor="p-email">
            <Input id="p-email" type="email" defaultValue="sean@cal.com" readOnly nativeInput/>
          </SettingsField>
          <SettingsField label="Language" htmlFor="p-lang">
            <NativeSelect id="p-lang" defaultValue="en" onChange={() => setDirty(true)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </NativeSelect>
          </SettingsField>
          <SettingsField label="Timezone" htmlFor="p-tz">
            <NativeSelect id="p-tz" defaultValue="utc-5" onChange={() => setDirty(true)} icon={<GlobeIcon className="size-3.5 opacity-60"/>}>
              <option value="utc-8">Pacific (UTC−8)</option>
              <option value="utc-5">Eastern (UTC−5)</option>
              <option value="utc">UTC</option>
              <option value="utc+1">Central European (UTC+1)</option>
              <option value="utc+9">Japan (UTC+9)</option>
            </NativeSelect>
          </SettingsField>
        </SettingsSection>

        <Separator className="my-8"/>

        <SettingsSection title="Security" className="mt-8">
          <SecurityRow icon={<ShieldCheckIcon className="size-4"/>} title="Two-factor authentication" description="Authenticator app · enabled" cta="Manage"/>
          <SecurityRow icon={<KeyRoundIcon className="size-4"/>} title="Active sessions" description="3 devices · last active 2 minutes ago" cta="Review"/>
          <SecurityRow destructive icon={<TrashIcon className="size-4"/>} title="Delete account" description="Permanently remove your account and personal data." cta="Delete"/>
        </SettingsSection>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-8 py-3">
          <Eyebrow>
            {dirty() ? "Unsaved changes" : "All saved"}
          </Eyebrow>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" type="button" disabled={!dirty()} onClick={() => setDirty(false)}>
              Discard
            </Button>
            <Button size="sm" type="button" disabled={!dirty()}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>);
}
function SecurityRow({ icon, title, description, cta, destructive, }: {
    icon: JSX.Element;
    title: string;
    description: string;
    cta: string;
    destructive?: boolean;
}) {
    return (<div className={`flex items-center gap-4 rounded-lg border p-3.5 ${destructive
            ? "border-destructive/40 bg-destructive/[0.03]"
            : "border-border/60 bg-background/40"}`}>
      <div className={`flex size-8 shrink-0 items-center justify-center rounded-md ${destructive ? "bg-destructive/10 text-destructive" : "bg-foreground/[0.06]"}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm">{title}</div>
        <p className="mt-0.5 text-muted-foreground text-xs">{description}</p>
      </div>
      <Button variant={destructive ? "outline" : "ghost"} size="sm" type="button" className={destructive ? "border-destructive/40 text-destructive hover:bg-destructive/10" : ""}>
        {cta}
      </Button>
    </div>);
}
