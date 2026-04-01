import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRequests } from "@/services/requestsService";

export default function Dashboard() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["dashboard-requests"],
    queryFn: () => getRequests(1, 1000), // Get all requests for dashboard
  });

  const requests = response?.data || [];

  const stats = [
    {
      title: "إجمالي الطلبات",
      value: response?.count || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      title: "هذا الشهر",
      value: requests?.filter((r) => {
        const requestDate = new Date(r.createdAt);
        const now = new Date();
        return (
          requestDate.getMonth() === now.getMonth() &&
          requestDate.getFullYear() === now.getFullYear()
        );
      }).length || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      title: "اليوم",
      value: requests?.filter((r) => {
        const requestDate = new Date(r.createdAt);
        const now = new Date();
        return requestDate.toDateString() === now.toDateString();
      }).length || 0,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },

  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          نظرة عامة على طلبات العملاء والإحصائيات
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  stat.value
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">الطلبات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="space-y-3">
              {requests.slice(0, 5).map((request) => (
                <div
                  key={request._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 rounded-lg border p-3 sm:p-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{request.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {request.phone} • {request.monthlySales}
                    </p>
                  </div>
                  <div className="text-right sm:text-left">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm sm:text-base text-muted-foreground py-8">
              لا توجد طلبات بعد
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
