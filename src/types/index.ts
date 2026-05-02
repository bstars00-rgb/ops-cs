export type CaseType =
  | "BOOKING_CONFIRMATION"
  | "HOTEL_CANNOT_FIND_RESERVATION"
  | "URGENT_CHECKIN_ISSUE"
  | "ROOM_TYPE_MISMATCH"
  | "CANCELLATION"
  | "REFUND"
  | "NO_SHOW_DISPUTE"
  | "OVERBOOKING"
  | "SUPPLIER_DELAY"
  | "CLIENT_INQUIRY"
  | "INVOICE_FOLLOW_UP"
  | "PAYMENT_OVERDUE"
  | "PAYMENT_DISPUTE"
  | "PARTIAL_PAYMENT"
  | "CREDIT_LIMIT_WARNING"
  | "BOOKING_HOLD"
  | "MANAGER_ESCALATION"
  | "GENERAL_OPS";

export type CaseStatus =
  | "NEW"
  | "AI_REVIEWING"
  | "DATA_MATCH_NEEDED"
  | "RESERVATION_MATCHED"
  | "NEED_MORE_INFO_FROM_CLIENT"
  | "HOTEL_CONFIRMATION_REQUIRED"
  | "SUPPLIER_CONFIRMATION_REQUIRED"
  | "HOTEL_INQUIRY_DRAFTED"
  | "WAITING_FOR_HUMAN_APPROVAL"
  | "HOTEL_CONTACTED"
  | "SUPPLIER_CONTACTED"
  | "WAITING_FOR_HOTEL"
  | "WAITING_FOR_SUPPLIER"
  | "WAITING_FOR_CLIENT"
  | "FIRST_CHASE_SENT"
  | "SECOND_CHASE_SENT"
  | "INVOICE_SENT"
  | "PAYMENT_PENDING"
  | "DUE_SOON"
  | "DUE_TODAY"
  | "OVERDUE_D1"
  | "FIRST_PAYMENT_REMINDER_SENT"
  | "OVERDUE_D3"
  | "SECOND_PAYMENT_REMINDER_SENT"
  | "FINANCE_REVIEWING"
  | "CREDIT_LIMIT_WARNING"
  | "CREDIT_LIMIT_EXCEEDED"
  | "BOOKING_HOLD_RECOMMENDED"
  | "MANAGER_APPROVAL_REQUIRED"
  | "ESCALATED_TO_HUMAN"
  | "ESCALATED_TO_MANAGER"
  | "RESOLVED"
  | "CLOSED"
  | "REOPENED"
  | "FAILED_UNRESOLVED";

export type Priority = "P0" | "P1" | "P2" | "P3";
export type RiskBand = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Case {
  id: string;
  code: string;
  type: CaseType;
  status: CaseStatus;
  priority: Priority;
  riskScore: number;
  ownerName: string;
  clientName: string;
  hotelName?: string;
  bookingCode?: string;
  subject: string;
  preview: string;
  language: "ko" | "en" | "vi" | "ja" | "zh";
  slaRemainingSec: number; // negative = breached
  slaTotalSec: number;
  createdAt: string;
  updatedAt: string;
  unread?: boolean;
}

export interface Hotel {
  id: string;
  code: string;
  name: string;
  country: string;
  language: string;
  responseRate30d: number;
  avgResponseSec: number;
  slaResponseSec: number;
  autoSendAllowed: boolean;
  contactsCount: number;
  lastContactedAt?: string;
}

export interface Client {
  id: string;
  code: string;
  name: string;
  country: string;
  tier: "VIP" | "Premium" | "Standard" | "Trial";
  language: string;
  accountManager: string;
  creditLimit: number;
  outstanding: number;
  pipeline: number;
  utilizationPct: number;
  avgDso: number;
  bookings30d: number;
  cases30d: number;
  currency: string;
}

export interface Invoice {
  id: string;
  code: string;
  clientName: string;
  amount: number;
  paid: number;
  balance: number;
  currency: string;
  status: "DRAFT" | "SENT" | "VIEWED" | "PAID" | "PARTIAL" | "DISPUTED" | "VOID";
  issueDate: string;
  dueDate: string;
  daysToDue: number;
  agingBucket: "0-30" | "31-60" | "61-90" | "90+" | null;
}

export interface Escalation {
  id: string;
  caseCode: string;
  reason: string;
  riskBand: RiskBand;
  level: number;
  recipientRole: string;
  ackDeadlineSec: number;
  triggeredAt: string;
  summary: string;
}

export interface Approval {
  id: string;
  kind: "DRAFT_SEND" | "REFUND" | "WRITE_OFF" | "CREDIT_HOLD_OVERRIDE" | "LIMIT_INCREASE";
  caseCode?: string;
  requesterName: string;
  subject: string;
  riskBand: RiskBand;
  deadlineSec: number;
  aiRecommendation: string;
}

export interface CaseMessage {
  id: string;
  caseId: string;
  direction: "INBOUND" | "OUTBOUND" | "INTERNAL_NOTE" | "AI_ACTION" | "STATUS_CHANGE" | "ESCALATION";
  actor: string;
  actorKind: "USER" | "AI" | "SYSTEM" | "CLIENT" | "HOTEL" | "SUPPLIER";
  subject?: string;
  body: string;
  language?: string;
  at: string;
  pendingApproval?: boolean;
  confidence?: number;
}
