import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">الإعدادات</h1>
        <p className="text-muted-foreground">
          إدارة تفضيلات لوحة الإدارة الخاصة بك
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>الإعدادات العامة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-name">اسم المسؤول</Label>
            <Input id="admin-name" placeholder="أدخل اسمك" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email">البريد الإلكتروني</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
            />
          </div>
          <Button>حفظ التغييرات</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>الإشعارات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>إشعارات البريد الإلكتروني</Label>
              <p className="text-sm text-muted-foreground">
                استلام بريد إلكتروني عند وصول طلبات جديدة
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>إشعارات المتصفح</Label>
              <p className="text-sm text-muted-foreground">
                عرض إشعارات المتصفح للطلبات الجديدة
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>تفضيلات العرض</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>الوضع الداكن</Label>
              <p className="text-sm text-muted-foreground">
                تفعيل المظهر الداكن
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>دعم RTL</Label>
              <p className="text-sm text-muted-foreground">
                تفعيل التخطيط من اليمين لليسار للغة العربية
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
