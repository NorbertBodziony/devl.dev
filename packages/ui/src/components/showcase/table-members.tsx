// @ts-nocheck
import { createSignal } from "solid-js";
import {
  EllipsisIcon,
  MailIcon,
  ShieldIcon,
  TrashIcon,
  UserPlusIcon,
} from "lucide-solid";
import { Avatar, AvatarFallback } from "@orbit/ui/avatar";
import { Badge } from "@orbit/ui/badge";
import { Button } from "@orbit/ui/button";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@orbit/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@orbit/ui/table";

type Role = "owner" | "admin" | "member" | "viewer";

const ROLES: { label: string; value: Role }[] = [
  { label: "Owner", value: "owner" },
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
  { label: "Viewer", value: "viewer" },
];

interface Member {
  name: string;
  email: string;
  initials: string;
  tone: string;
  role: Role;
  team: string;
  active: string;
  twoFactor: boolean;
  pending?: boolean;
}

const MEMBERS: Member[] = [
  { name: "Ada Lovelace", email: "ada@calculus.dev", initials: "AL", tone: "bg-rose-500/15 text-rose-600 dark:text-rose-300", role: "owner", team: "Engineering", active: "Active now", twoFactor: true },
  { name: "Grace Hopper", email: "grace@cobol.io", initials: "GH", tone: "bg-amber-500/15 text-amber-600 dark:text-amber-300", role: "admin", team: "Engineering", active: "2m ago", twoFactor: true },
  { name: "Alan Turing", email: "alan@enigma.uk", initials: "AT", tone: "bg-sky-500/15 text-sky-600 dark:text-sky-300", role: "admin", team: "Research", active: "12m ago", twoFactor: false },
  { name: "Linus Torvalds", email: "linus@kernel.org", initials: "LT", tone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300", role: "member", team: "Engineering", active: "1h ago", twoFactor: true },
  { name: "Margaret Hamilton", email: "margaret@apollo.nasa", initials: "MH", tone: "bg-violet-500/15 text-violet-600 dark:text-violet-300", role: "member", team: "Research", active: "Yesterday", twoFactor: true },
  { name: "Edsger Dijkstra", email: "edsger@graph.nl", initials: "ED", tone: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300", role: "viewer", team: "Design", active: "3 days ago", twoFactor: false, pending: true },
];

export function TableMembersShowcasePage() {
  return (
    <div className="min-h-svh bg-background px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-xl">Members</h1>
            <p className="text-muted-foreground text-sm">
              6 people · 2 pending invites
            </p>
          </div>
          <Button size="sm">
            <UserPlusIcon />
            Invite
          </Button>
        </header>

        <div className="rounded-xl border bg-card shadow-xs/5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="ps-4">Member</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead className="pe-4 w-px" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {MEMBERS.map((m) => (
                <TableRow key={m.email}>
                  <TableCell className="ps-4">
                    <div className="flex items-center gap-3">
                      <Avatar className={"size-8 " + m.tone}>
                        <AvatarFallback className="bg-transparent font-medium text-[11px]">
                          {m.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{m.name}</span>
                          {m.pending ? (
                            <Badge variant="outline" size="sm" className="font-mono text-[9px] uppercase tracking-wider">
                              pending
                            </Badge>
                          ) : null}
                        </div>
                        <div className="text-muted-foreground text-xs">{m.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.team}</TableCell>
                  <TableCell>
                    {m.role === "owner" ? (
                      <Badge variant="outline" className="gap-1">
                        <ShieldIcon className="size-3" />
                        Owner
                      </Badge>
                    ) : (
                      <Select items={ROLES} defaultValue={m.role}>
                        <SelectTrigger className="h-8 w-32 text-sm" size="sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectPopup>
                          {ROLES.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectPopup>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-1.5">
                      <span
                        className={
                          "size-1.5 rounded-full " +
                          (m.twoFactor ? "bg-emerald-500" : "bg-muted-foreground/40")
                        }
                      />
                      <span className="text-muted-foreground text-xs">
                        {m.twoFactor ? "Enabled" : "Off"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">{m.active}</TableCell>
                  <TableCell className="pe-4">
                    <MemberActions name={m.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function MemberActions(props: { name: string }) {
  const [open, setOpen] = createSignal(false);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        aria-label={`Actions for ${props.name}`}
        onClick={() => setOpen((current) => !current)}
        className="relative inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-transparent text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground [&_svg]:size-4"
      >
        <EllipsisIcon />
      </button>
      {open() ? (
        <div className="absolute right-0 top-[calc(100%+0.25rem)] z-50 min-w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          <button type="button" className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent">
            <MailIcon className="size-4" /> Send email
          </button>
          <button type="button" className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent">
            Transfer ownership
          </button>
          <div className="my-1 h-px bg-border" />
          <button type="button" className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-destructive hover:bg-destructive/10">
            <TrashIcon className="size-4" /> Remove
          </button>
        </div>
      ) : null}
    </div>
  );
}
