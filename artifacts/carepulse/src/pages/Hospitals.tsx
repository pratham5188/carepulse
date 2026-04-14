import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital as HospitalIcon, MapPin, Phone, Mail, Bed, Activity, Filter, ChevronDown, ChevronLeft, ChevronRight, Search, X, Map } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HospitalData {
  id: number;
  name: string;
  state: string;
  city: string;
  area: string;
  location: string;
  bedCapacity: number;
  icuCapacity: number;
  currentOccupancy: number;
  specializedDepartments: string[];
  contactNumber: string;
  email: string;
}

interface BrowseResponse {
  hospitals: HospitalData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Hospitals() {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [state, setState] = useState("all");
  const [city, setCity] = useState("all");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [searchDebounced, state, city, department]);

  useEffect(() => {
    setCity("all");
  }, [state]);

  const { data: states = [] } = useQuery<string[]>({
    queryKey: ["/api/hospitals-states"],
    queryFn: async () => {
      const res = await fetch("/api/hospitals-states", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: cities = [] } = useQuery<string[]>({
    queryKey: ["/api/hospitals-cities", state],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (state !== "all") params.set("state", state);
      const res = await fetch(`/api/hospitals-cities?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: state !== "all",
  });

  const { data, isLoading } = useQuery<BrowseResponse>({
    queryKey: ["/api/hospitals-browse", searchDebounced, state, city, department, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchDebounced) params.set("search", searchDebounced);
      if (state !== "all") params.set("state", state);
      if (city !== "all") params.set("city", city);
      if (department) params.set("department", department);
      params.set("page", String(page));
      params.set("limit", "30");
      const res = await fetch(`/api/hospitals-browse?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch hospitals");
      return res.json();
    },
  });

  const hospitalsList = data?.hospitals || [];
  const totalPages = data?.totalPages || 0;
  const total = data?.total || 0;

  const hasActiveFilters = state !== "all" || city !== "all" || department !== "" || search !== "";

  const clearFilters = () => {
    setSearch("");
    setState("all");
    setCity("all");
    setDepartment("");
    setPage(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-bold">India Healthcare Network</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Browse {total > 0 ? total.toLocaleString() : "70,000+"} hospitals across India — search, filter, and find the right care.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className={cn("shrink-0", showFilters && "border-primary text-primary")}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && <span className="ml-2 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">!</span>}
          <ChevronDown className={cn("h-4 w-4 ml-2 transition-transform", showFilters && "rotate-180")} />
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by hospital name or city..."
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {showFilters && (
        <Card className="border-dashed shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Map className="h-3 w-3" /> State
                </label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent className="bg-background max-h-[300px]">
                    <SelectItem value="all">All States</SelectItem>
                    {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" /> City
                </label>
                <Select value={city} onValueChange={setCity} disabled={state === "all"}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={state === "all" ? "Select a state first" : "All Cities"} />
                  </SelectTrigger>
                  <SelectContent className="bg-background max-h-[300px]">
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Activity className="h-3 w-3" /> Department
                </label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Cardiology, Orthopedics"
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:border-primary focus:ring-1 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  <X className="h-4 w-4 mr-1" /> Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : hospitalsList.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * 30) + 1}–{Math.min(page * 30, total)} of {total.toLocaleString()} hospitals
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {hospitalsList.map((hospital) => (
              <Card key={hospital.id} className="hover:shadow-md transition-shadow h-full flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <HospitalIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{hospital.name}</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{hospital.city}, {hospital.state}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col pt-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Bed className="h-3 w-3" /> Beds
                      </p>
                      <p className="font-semibold text-sm">{hospital.currentOccupancy}/{hospital.bedCapacity}</p>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-500", 
                            (hospital.currentOccupancy / hospital.bedCapacity) > 0.85 ? "bg-red-500" :
                            (hospital.currentOccupancy / hospital.bedCapacity) > 0.6 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min((hospital.currentOccupancy / hospital.bedCapacity) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Activity className="h-3 w-3" /> ICU
                      </p>
                      <p className="font-semibold text-sm">{hospital.icuCapacity} Units</p>
                    </div>
                  </div>

                  {hospital.specializedDepartments && hospital.specializedDepartments.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Departments</p>
                      <div className="flex flex-wrap gap-1">
                        {hospital.specializedDepartments.slice(0, 5).map((dept) => (
                          <span key={dept} className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-semibold border border-primary/10">
                            {dept}
                          </span>
                        ))}
                        {hospital.specializedDepartments.length > 5 && (
                          <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-semibold">
                            +{hospital.specializedDepartments.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-3 border-t border-border/50 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{hospital.contactNumber}</span>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-primary"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + " " + hospital.location)}`, '_blank')}
                        title="View on Google Maps"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{hospital.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <div className="flex items-center gap-1">
                {page > 2 && (
                  <>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setPage(1)}>1</Button>
                    {page > 3 && <span className="text-muted-foreground px-1">...</span>}
                  </>
                )}
                {[page - 1, page, page + 1].filter(p => p >= 1 && p <= totalPages).map(p => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                {page < totalPages - 1 && (
                  <>
                    {page < totalPages - 2 && <span className="text-muted-foreground px-1">...</span>}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setPage(totalPages)}>{totalPages}</Button>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center space-y-3">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <HospitalIcon className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-lg">No hospitals found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>Clear all filters</Button>
          )}
        </div>
      )}
    </div>
  );
}
