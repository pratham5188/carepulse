import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Users,
  Search,
  Shield,
  UserCog,
  Stethoscope,
  User as UserIcon,
  Loader2,
  Calendar,
  Mail,
} from "lucide-react";

interface UserRecord {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  profileImageUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

const roleIcons: Record<string, React.ReactNode> = {
  admin: <Shield className="h-4 w-4" />,
  doctor: <Stethoscope className="h-4 w-4" />,
  patient: <UserIcon className="h-4 w-4" />,
};

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  doctor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  patient: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { data: users = [], isLoading } = useQuery<UserRecord[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Role updated", description: "User role has been changed successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update user role.", variant: "destructive" });
    },
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      (u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (u.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    doctor: users.filter((u) => u.role === "doctor").length,
    patient: users.filter((u) => u.role === "patient").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-display font-bold flex items-center gap-3">
          <UserCog className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
          User Management
        </h1>
        <p className="text-muted-foreground">Manage platform users, roles, and permissions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roleCounts.total}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roleCounts.admin}</p>
              <p className="text-xs text-muted-foreground">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roleCounts.doctor}</p>
              <p className="text-xs text-muted-foreground">Doctors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <UserIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roleCounts.patient}</p>
              <p className="text-xs text-muted-foreground">Patients</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Search and manage user accounts across the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left font-medium p-3">User</th>
                    <th className="text-left font-medium p-3">Email</th>
                    <th className="text-left font-medium p-3">Role</th>
                    <th className="text-left font-medium p-3">Joined</th>
                    <th className="text-left font-medium p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                              {u.firstName?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="font-medium">
                                {u.firstName || u.lastName
                                  ? `${u.firstName || ""} ${u.lastName || ""}`.trim()
                                  : "No name"}
                              </p>
                              <p className="text-xs text-muted-foreground">ID: {u.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{u.email || "N/A"}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className={`gap-1 ${roleColors[u.role || "patient"]}`}>
                            {roleIcons[u.role || "patient"]}
                            <span className="capitalize">{u.role || "patient"}</span>
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          {u.id === user?.id ? (
                            <span className="text-xs text-muted-foreground italic">Current user</span>
                          ) : (
                            <Select
                              value={u.role || "patient"}
                              onValueChange={(newRole) => {
                                updateRoleMutation.mutate({ userId: u.id, role: newRole });
                              }}
                            >
                              <SelectTrigger className="w-[120px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="patient">Patient</SelectItem>
                                <SelectItem value="doctor">Doctor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-right">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
