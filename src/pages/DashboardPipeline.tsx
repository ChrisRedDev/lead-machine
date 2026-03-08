import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Sparkles, Building, User, Mail, ExternalLink, Trash2,
  MoreHorizontal, Download, RefreshCw, ChevronRight, X, StickyNote
} from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface PipelineLead {
  id: string;
  user_id: string;
  export_id: string | null;
  lead_index: number;
  company_name: string | null;
  contact_name: string | null;
  role: string | null;
  email: string | null;
  industry: string | null;
  fit_reason: string | null;
  score: number | null;
  stage: string;
  notes: string | null;
  created_at: string;
}

interface ExportLead {
  company_name: string;
  contact_person: string;
  role: string;
  email: string;
  industry: string;
  fit_reason: string;
  score?: number | string;
  website?: string;
}

interface LeadExport {
  id: string;
  name: string;
  leads: ExportLead[];
  lead_count: number;
  created_at: string;
}

type Stage = "new" | "contacted" | "meeting" | "closed";

const STAGES: { key: Stage; label: string; color: string; bg: string; dot: string }[] = [
  { key: "new",       label: "New",             color: "text-primary",     bg: "bg-primary/5 border-primary/15",       dot: "bg-primary" },
  { key: "contacted", label: "Contacted",        color: "text-warning",     bg: "bg-warning/5 border-warning/15",       dot: "bg-warning" },
  { key: "meeting",   label: "Meeting Booked",   color: "text-accent",      bg: "bg-accent/5 border-accent/15",         dot: "bg-accent" },
  { key: "closed",    label: "Closed",           color: "text-success",     bg: "bg-success/5 border-success/15",       dot: "bg-success" },
];

// ─── Draggable Lead Card ───────────────────────────────────────────────────────
const LeadCard = ({
  lead,
  onDelete,
  onNotes,
  compact = false,
}: {
  lead: PipelineLead;
  onDelete?: (id: string) => void;
  onNotes?: (lead: PipelineLead) => void;
  compact?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 999 }
    : undefined;

  const scoreColor =
    (lead.score || 0) >= 90 ? "text-success" :
    (lead.score || 0) >= 80 ? "text-primary" :
    (lead.score || 0) >= 70 ? "text-warning" : "text-muted-foreground";

  const scoreBadge =
    (lead.score || 0) >= 90 ? "bg-success/10 text-success border-success/25" :
    (lead.score || 0) >= 80 ? "bg-primary/10 text-primary border-primary/25" :
    (lead.score || 0) >= 70 ? "bg-warning/10 text-warning border-warning/25" :
    "bg-muted text-muted-foreground border-border";

  const scoreLabel =
    (lead.score || 0) >= 90 ? "High" :
    (lead.score || 0) >= 80 ? "Good" :
    (lead.score || 0) >= 70 ? "Mid" : "Low";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-xl border border-border bg-card p-3 cursor-grab active:cursor-grabbing select-none transition-shadow ${
        isDragging ? "shadow-2xl opacity-80 scale-105" : "hover:border-border/80 hover:shadow-md"
      } ${compact ? "" : ""}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold truncate">{lead.company_name || "Unknown"}</p>
          <p className="text-[11px] text-muted-foreground truncate">{lead.contact_name} · {lead.role}</p>
        </div>
        {lead.score && (
          <span className={`text-[11px] font-bold shrink-0 px-2 py-0.5 rounded-full border ${scoreBadge}`}>
            {scoreLabel} · {lead.score}
          </span>
        )}
      </div>

      {!compact && lead.fit_reason && (
        <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">{lead.fit_reason}</p>
      )}

      <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="text-[10px] px-1.5 py-0.5 rounded bg-secondary hover:bg-secondary/70 text-muted-foreground transition-colors flex items-center gap-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail className="w-2.5 h-2.5" />
          </a>
        )}
        {onNotes && (
          <button
            className="text-[10px] px-1.5 py-0.5 rounded bg-secondary hover:bg-secondary/70 text-muted-foreground transition-colors"
            onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onClick={(e) => { e.stopPropagation(); onNotes(lead); }}
          >
            <StickyNote className="w-2.5 h-2.5" />
          </button>
        )}
        {onDelete && (
          <button
            className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-secondary hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
            onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}
          >
            <Trash2 className="w-2.5 h-2.5" />
          </button>
        )}
      </div>

      {lead.notes && (
        <div className="mt-2 p-2 rounded-lg bg-secondary/60 text-[11px] text-muted-foreground line-clamp-2">
          📝 {lead.notes}
        </div>
      )}
    </div>
  );
};

// ─── Droppable Column ─────────────────────────────────────────────────────────
const KanbanColumn = ({
  stage,
  leads,
  onDelete,
  onNotes,
}: {
  stage: typeof STAGES[number];
  leads: PipelineLead[];
  onDelete: (id: string) => void;
  onNotes: (lead: PipelineLead) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl border p-3 min-h-[200px] transition-colors ${
        isOver ? stage.bg + " ring-1 ring-inset ring-current" : "border-border bg-secondary/20"
      }`}
      style={{ minWidth: 240, maxWidth: 280, flex: "1 0 240px" }}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={`w-2 h-2 rounded-full shrink-0 ${stage.dot}`} />
        <span className={`text-xs font-semibold ${stage.color}`}>{stage.label}</span>
        <span className="ml-auto text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full font-medium">
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 flex-1">
        <AnimatePresence>
          {leads.map((lead) => (
            <motion.div
              key={lead.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <LeadCard lead={lead} onDelete={onDelete} onNotes={onNotes} />
            </motion.div>
          ))}
        </AnimatePresence>
        {leads.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-[11px] text-muted-foreground/50 py-6 border-2 border-dashed border-border/30 rounded-xl">
            Drop leads here
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Add Lead Modal ────────────────────────────────────────────────────────────
const AddLeadModal = ({
  open,
  onClose,
  exports,
  existingLeadIds,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  exports: LeadExport[];
  existingLeadIds: string[];
  onAdd: (exportId: string, leadIndex: number, lead: ExportLead) => void;
}) => {
  const [selectedExport, setSelectedExport] = useState<string>("");

  const selectedLeads: ExportLead[] = selectedExport
    ? ((exports.find((e) => e.id === selectedExport)?.leads as ExportLead[]) || [])
    : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-display">Add Leads to Pipeline</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div className="space-y-2">
            {exports.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setSelectedExport(exp.id === selectedExport ? "" : exp.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selectedExport === exp.id
                    ? "bg-primary/10 border-primary/30"
                    : "border-border hover:bg-secondary/50"
                }`}
              >
                <Building className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{exp.name}</p>
                  <p className="text-xs text-muted-foreground">{exp.lead_count} leads · {new Date(exp.created_at).toLocaleDateString()}</p>
                </div>
              </button>
            ))}
          </div>

          {selectedLeads.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Leads</p>
              {selectedLeads.map((lead, idx) => {
                const alreadyAdded = existingLeadIds.includes(`${selectedExport}-${idx}`);
                return (
                  <button
                    key={idx}
                    disabled={alreadyAdded}
                    onClick={() => { onAdd(selectedExport, idx, lead); onClose(); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                      alreadyAdded
                        ? "border-border opacity-40 cursor-not-allowed"
                        : "border-border hover:bg-secondary/50 hover:border-primary/20"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{lead.company_name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{lead.contact_person} · {lead.role}</p>
                    </div>
                    {alreadyAdded && <span className="text-[10px] text-muted-foreground shrink-0">Added</span>}
                    {!alreadyAdded && <Plus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Notes Modal ─────────────────────────────────────────────────────────────
const NotesModal = ({
  lead,
  onClose,
  onSave,
}: {
  lead: PipelineLead | null;
  onClose: () => void;
  onSave: (id: string, notes: string) => void;
}) => {
  const [notes, setNotes] = useState(lead?.notes || "");
  useEffect(() => { setNotes(lead?.notes || ""); }, [lead]);
  if (!lead) return null;
  return (
    <Dialog open={!!lead} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[14px] font-display">Notes — {lead.company_name}</DialogTitle>
        </DialogHeader>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this lead…"
          className="min-h-[120px] rounded-xl bg-secondary border-border text-sm resize-none"
        />
        <Button
          onClick={() => { onSave(lead.id, notes); onClose(); }}
          className="w-full h-9 rounded-xl bg-gradient-primary text-sm"
        >
          Save Notes
        </Button>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const DashboardPipeline = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<PipelineLead[]>([]);
  const [exports, setExports] = useState<LeadExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notesLead, setNotesLead] = useState<PipelineLead | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pipelineSearch, setPipelineSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState<"all" | "high" | "good" | "medium">("all");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [pipelineRes, exportsRes] = await Promise.all([
        supabase.from("lead_pipeline" as any).select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
        supabase.from("lead_exports").select("id, name, leads, lead_count, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (!pipelineRes.error && pipelineRes.data) setLeads(pipelineRes.data as unknown as PipelineLead[]);
      if (!exportsRes.error && exportsRes.data) setExports(exportsRes.data as unknown as LeadExport[]);
      setLoading(false);
    };
    load();
  }, [user]);

  const existingLeadIds = leads.map((l) => `${l.export_id}-${l.lead_index}`);

  const addLead = async (exportId: string, leadIndex: number, lead: ExportLead) => {
    const newLead = {
      user_id: user!.id,
      export_id: exportId,
      lead_index: leadIndex,
      company_name: lead.company_name,
      contact_name: lead.contact_person,
      role: lead.role,
      email: lead.email,
      industry: lead.industry,
      fit_reason: lead.fit_reason,
      score: lead.score ? parseInt(String(lead.score)) : null,
      stage: "new",
      notes: null,
    };
    const { data, error } = await supabase.from("lead_pipeline" as any).insert(newLead).select().single();
    if (!error && data) {
      setLeads((prev) => [...prev, data as unknown as PipelineLead]);
      toast.success(`${lead.company_name} added to pipeline!`);
    } else {
      toast.error("Failed to add lead");
    }
  };

  const deleteLead = async (id: string) => {
    await supabase.from("lead_pipeline" as any).delete().eq("id", id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast.success("Lead removed from pipeline");
  };

  const saveNotes = async (id: string, notes: string) => {
    await supabase.from("lead_pipeline" as any).update({ notes }).eq("id", id);
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, notes } : l));
    toast.success("Notes saved");
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const leadId = String(active.id);
    const newStage = String(over.id) as Stage;
    const validStages = STAGES.map((s) => s.key);
    if (!validStages.includes(newStage as Stage)) return;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage === newStage) return;

    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, stage: newStage } : l));
    const { error } = await supabase.from("lead_pipeline" as any).update({ stage: newStage }).eq("id", leadId);
    if (error) {
      toast.error("Failed to update stage");
      setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, stage: lead.stage } : l));
    }
  };

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  const stageLeads = (stage: Stage) => {
    let filtered = leads.filter((l) => l.stage === stage);
    if (pipelineSearch.trim()) {
      const q = pipelineSearch.toLowerCase();
      filtered = filtered.filter(l =>
        l.company_name?.toLowerCase().includes(q) ||
        l.contact_name?.toLowerCase().includes(q) ||
        l.role?.toLowerCase().includes(q)
      );
    }
    if (scoreFilter !== "all") {
      filtered = filtered.filter(l => {
        const n = l.score || 0;
        if (scoreFilter === "high") return n >= 90;
        if (scoreFilter === "good") return n >= 80 && n < 90;
        if (scoreFilter === "medium") return n >= 70 && n < 80;
        return true;
      });
    }
    return filtered;
  };

  const totalLeads = leads.length;
  const closedLeads = stageLeads("closed").length;
  const meetingLeads = stageLeads("meeting").length;

  return (
    <>
      <DashboardHeader title="Pipeline" />
      <main className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-display font-bold tracking-tight">Lead Pipeline</h2>
            <p className="text-sm text-muted-foreground">
              {totalLeads} leads · {meetingLeads} meetings · {closedLeads} closed
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="h-9 rounded-xl bg-gradient-primary text-sm">
            <Plus className="w-4 h-4 mr-1.5" />Add Leads
          </Button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {STAGES.map((stage) => {
            const count = stageLeads(stage.key).length;
            const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
            return (
              <Card key={stage.key} className="p-3 border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                  <span className="text-[11px] text-muted-foreground">{stage.label}</span>
                </div>
                <p className={`text-xl font-bold ${stage.color}`}>{count}</p>
                <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${stage.dot}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STAGES.map((stage) => (
                <KanbanColumn
                  key={stage.key}
                  stage={stage}
                  leads={stageLeads(stage.key)}
                  onDelete={deleteLead}
                  onNotes={setNotesLead}
                />
              ))}
            </div>

            <DragOverlay>
              {activeLead && (
                <div className="rotate-3 shadow-2xl opacity-90">
                  <LeadCard lead={activeLead} compact />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}

        {totalLeads === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <Building className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium mb-1">No leads in pipeline</p>
            <p className="text-xs mb-4">Add leads from your exports to start tracking them</p>
            <Button onClick={() => setShowAddModal(true)} className="h-9 rounded-xl bg-gradient-primary text-sm">
              <Plus className="w-4 h-4 mr-1.5" />Add First Lead
            </Button>
          </div>
        )}
      </main>

      <AddLeadModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        exports={exports}
        existingLeadIds={existingLeadIds}
        onAdd={addLead}
      />

      <NotesModal
        lead={notesLead}
        onClose={() => setNotesLead(null)}
        onSave={saveNotes}
      />
    </>
  );
};

export default DashboardPipeline;
