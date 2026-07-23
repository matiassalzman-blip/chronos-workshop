import { Client, Entry, Project, User } from "@/lib/chronos/types";
import { toISODate } from "@/lib/chronos/date";

export const users: User[] = [
  { id: "u1", name: "Lu Fernandez", initials: "LF" },
  { id: "u2", name: "Sam Rivera", initials: "SR" },
  { id: "u3", name: "Priya Anand", initials: "PA" }
];

export const clients: Client[] = [
  { id: "c1", name: "Acme Co" },
  { id: "c2", name: "Northwind" }
];

export const projects: Project[] = [
  { id: "p1", name: "Website Redesign", clientId: "c1" },
  { id: "p2", name: "Mobile App", clientId: "c2" },
  { id: "p3", name: "Support Retainer", clientId: "c1" },
  { id: "p4", name: "Team Ops", clientId: null }
];

/** Generates a realistic starter week of entries for a given user, dated relative to today. */
export function createSeedEntries(userId: string): Entry[] {
  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return toISODate(d);
  };

  return [
    {
      id: `${userId}-seed-1`,
      userId,
      projectId: "p1",
      date: daysAgo(0),
      hours: 4,
      description: "Homepage hero section revisions",
      billable: true,
      tags: ["design"]
    },
    {
      id: `${userId}-seed-2`,
      userId,
      projectId: "p4",
      date: daysAgo(0),
      hours: 1,
      description: "Weekly team sync and planning",
      billable: false,
      tags: []
    },
    {
      id: `${userId}-seed-3`,
      userId,
      projectId: "p2",
      date: daysAgo(1),
      hours: 6,
      description: "Checkout flow component build",
      billable: true,
      tags: ["frontend"]
    },
    {
      id: `${userId}-seed-4`,
      userId,
      projectId: "p3",
      date: daysAgo(2),
      hours: 2.5,
      description: "Client call and follow-up notes",
      billable: true,
      tags: ["client-call"]
    },
    {
      id: `${userId}-seed-5`,
      userId,
      projectId: "p1",
      date: daysAgo(4),
      hours: 3.25,
      description: "Design QA on staging build",
      billable: true,
      tags: []
    }
  ];
}
