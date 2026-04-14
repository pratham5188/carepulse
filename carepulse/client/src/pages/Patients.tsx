import { useState, useMemo } from "react";
import { usePatients } from "@/hooks/use-medical-data";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Filter, Plus, User, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Patients() {
  const { data: patients, isLoading } = usePatients();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCondition, setFilterCondition] = useState<string>("all");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredPatients = useMemo(() => {
    if (!patients) return [];
    return patients.filter(p => {
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.gender.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCondition = filterCondition === "all" || p.condition === filterCondition;
      const matchesRisk = filterRisk === "all" || p.riskLevel === filterRisk;
      return matchesSearch && matchesCondition && matchesRisk;
    });
  }, [patients, searchQuery, filterCondition, filterRisk]);

  const hasActiveFilters = filterCondition !== "all" || filterRisk !== "all" || searchQuery !== "";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">Patients</h1>
          <p className="text-muted-foreground">Manage patient records and assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Patient
        </button>
      </header>

      <div className="flex gap-4 items-center bg-card p-2 rounded-xl border border-border w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients by name..." 
            className="w-full pl-9 pr-4 py-2 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/70"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="h-6 w-px bg-border" />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 transition-colors rounded-lg ${showFilters ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 items-center bg-card p-4 rounded-xl border border-dashed border-border animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Condition:</span>
            {["all", "Stable", "Critical", "Recovering"].map(c => (
              <button
                key={c}
                onClick={() => setFilterCondition(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterCondition === c ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:bg-muted'
                }`}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Risk:</span>
            {["all", "Low", "Medium", "High"].map(r => (
              <button
                key={r}
                onClick={() => setFilterRisk(r)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterRisk === r ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:bg-muted'
                }`}
              >
                {r === "all" ? "All" : r}
              </button>
            ))}
          </div>
          {hasActiveFilters && (
            <>
              <div className="h-6 w-px bg-border" />
              <button
                onClick={() => { setFilterCondition("all"); setFilterRisk("all"); setSearchQuery(""); }}
                className="text-xs text-destructive hover:underline font-medium"
              >
                Clear all
              </button>
            </>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {hasActiveFilters && (
            <div className="px-4 sm:px-6 py-2 bg-muted/30 border-b border-border text-xs text-muted-foreground">
              Showing {filteredPatients.length} of {patients?.length || 0} patients
            </div>
          )}
          <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Patient</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Risk Level</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Admission Date</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPatients.map((patient, i) => (
                <motion.tr 
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">{patient.age} yrs &bull; {patient.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.condition === 'Critical' ? 'bg-red-100 text-red-800' :
                      patient.condition === 'Recovering' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {patient.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.riskLevel === 'High' ? 'bg-red-100 text-red-800' : 
                      patient.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        patient.riskLevel === 'High' ? 'bg-red-600' : 
                        patient.riskLevel === 'Medium' ? 'bg-orange-600' : 'bg-green-600'
                      }`}></span>
                      {patient.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/patients/${patient.id}`} className="text-sm font-medium text-primary hover:underline">
                      View Details
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          </div>
          
          {filteredPatients.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">
                {hasActiveFilters ? "No matching patients" : "No patients found"}
              </h3>
              <p className="text-muted-foreground mt-1">
                {hasActiveFilters ? "Try adjusting your search or filters." : "Get started by adding a new patient."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() => { setFilterCondition("all"); setFilterRisk("all"); setSearchQuery(""); }}
                  className="mt-3 text-sm text-primary hover:underline font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showAddModal && (
          <AddPatientModal onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddPatientModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: hospitals } = useQuery<any[]>({
    queryKey: ["/api/hospitals-list"],
  });

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    condition: "Stable",
    riskLevel: "Low",
    hospitalId: "",
  });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          age: Number(data.age),
          hospitalId: data.hospitalId ? Number(data.hospitalId) : null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create patient");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.age) {
      setError("Name and age are required");
      return;
    }
    if (Number(form.age) < 0 || Number(form.age) > 150) {
      setError("Please enter a valid age");
      return;
    }
    mutation.mutate(form);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Add New Patient</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Enter patient name"
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Age *</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
                placeholder="Age"
                min="0"
                max="150"
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Gender *</label>
              <select
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
                className="w-full px-3 py-2 bg-popover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Condition *</label>
              <select
                value={form.condition}
                onChange={(e) => update("condition", e.target.value)}
                className="w-full px-3 py-2 bg-popover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="Stable">Stable</option>
                <option value="Recovering">Recovering</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Risk Level *</label>
              <select
                value={form.riskLevel}
                onChange={(e) => update("riskLevel", e.target.value)}
                className="w-full px-3 py-2 bg-popover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Assigned Hospital</label>
            <select
              value={form.hospitalId}
              onChange={(e) => update("hospitalId", e.target.value)}
              className="w-full px-3 py-2 bg-popover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select hospital (optional)</option>
              {hospitals?.map((h: any) => (
                <option key={h.id} value={h.id}>{h.name} - {h.city}, {h.state}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? "Adding..." : "Add Patient"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
