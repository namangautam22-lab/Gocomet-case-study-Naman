export type Mode = 'road' | 'ocean' | 'air' | 'rail';
export type JourneyStatus = 'on-track' | 'delayed' | 'blocked' | 'at-risk' | 'no-update' | 'completed';
export type Risk = 'low' | 'medium' | 'high' | 'critical';
export type LegStatus = 'pending' | 'in-transit' | 'completed' | 'delayed' | 'blocked';
export type MilestoneStatus = 'completed' | 'in-progress' | 'planned' | 'blocked';
export type RemarkType =
  | 'general'
  | 'delay-reason'
  | 'internal-handoff'
  | 'customer-comm'
  | 'action-required'
  | 'blocker'
  | 'resolution';
export type Priority = 'low' | 'medium' | 'high';
export type Visibility = 'internal' | 'external';

export interface Leg {
  id: string;
  mode: Mode;
  carrier: string;
  carrierCode: string;
  origin: string;
  destination: string;
  status: LegStatus;
  eta: string;
  actualArrival?: string;
  delayDays: number;
  currentMilestone: string;
  trackingRef: string;
  vessel?: string;
  flight?: string;
  truck?: string;
}

export interface Milestone {
  id: string;
  journeyId: string;
  legId?: string;
  name: string;
  type: 'system' | 'manual';
  status: MilestoneStatus;
  date: string;
  completedAt?: string;
  category?: string;
  owner?: string;
  note?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface Remark {
  id: string;
  journeyId: string;
  legId?: string;
  noteType: RemarkType;
  visibility: Visibility;
  appliesTo: string;
  assignee?: string;
  dueDate?: string;
  priority: Priority;
  text: string;
  author: string;
  createdAt: string;
}

export interface JourneyException {
  id: string;
  journeyId: string;
  legId?: string;
  type: string;
  severity: 'warning' | 'critical';
  description: string;
  status: 'open' | 'resolved';
  assignee?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Journey {
  id: string;
  shipmentRef: string;
  customer: string;
  customerCode: string;
  origin: string;
  destination: string;
  modeChain: Mode[];
  activeLeg: number;
  currentMilestone: string;
  overallETA: string;
  originalETA: string;
  delayDays: number;
  risk: Risk;
  status: JourneyStatus;
  owner: string;
  lastRemark?: string;
  lastRemarkAt?: string;
  updatedAt: string;
  createdAt: string;
  legs: Leg[];
  milestones: Milestone[];
  remarks: Remark[];
  exceptions: JourneyException[];
  incoterm: string;
  commodity: string;
  containerType?: string;
  weight: string;
}

export interface SavedView {
  id: string;
  name: string;
  description: string;
  scope: 'private' | 'team' | 'org';
  isDefault: boolean;
  isPinned: boolean;
  color: string;
  filters: Record<string, unknown>;
  columns: string[];
  sort?: { field: string; direction: 'asc' | 'desc' };
  alerts: {
    entersView: boolean;
    etaSlips: boolean;
    blockerAdded: boolean;
    dailyDigest: boolean;
  };
  createdBy: string;
  createdAt: string;
}

export interface ActiveFilters {
  mode: Mode | null;
  carrier: string | null;
  destination: string | null;
  etaRange: string | null;
  delayThreshold: number | null;
  owner: string | null;
  risk: Risk | null;
  hasRemarks: boolean;
  search: string;
}

export interface WhatChangedItem {
  id: string;
  journeyId: string;
  journeyRef: string;
  type: 'remark' | 'milestone' | 'status' | 'eta' | 'exception' | 'owner' | 'merge';
  description: string;
  by: string;
  at: string;
}

export interface CandidateLeg {
  id: string;
  mode: Mode;
  carrier: string;
  origin: string;
  destination: string;
  eta: string;
  trackingRef: string;
  confidence: number;
}
