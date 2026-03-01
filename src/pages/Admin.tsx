import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Car, CalendarDays, BookOpen, Plus, Pencil, Trash2,
  Clock, DollarSign, CheckCircle, XCircle, AlertCircle, Loader2,
  X, Upload, KeyRound, Database,
} from "lucide-react";
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from "@/hooks/useVehicles";
import { useBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from "@/hooks/useBlog";
import { uploadApi, seedApi } from "@/lib/api";
import type { Vehicle, Booking, BlogPost } from "@/lib/api";
import { toast } from "sonner";
import { formatVND, formatDateTime } from "@/lib/utils";

type Tab = "dashboard" | "vehicles" | "bookings" | "blog";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const statusIcons: Record<string, React.ElementType> = {
  pending: AlertCircle,
  confirmed: CheckCircle,
  cancelled: XCircle,
};

// ─── Image Upload Helper ─────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Vehicle Form Component ─────────────────────────────
interface VehicleFormProps {
  initial?: Vehicle;
  onSubmit: (data: Omit<Vehicle, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const VehicleForm = ({ initial, onSubmit, onCancel, loading }: VehicleFormProps) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    type: initial?.type || 'car' as Vehicle['type'],
    description: initial?.description || '',
    pricePerDay: initial?.pricePerDay || 0,
    pricePerHour: initial?.pricePerHour || 0,
    images: initial?.images || [] as string[],
    features: initial?.features?.join(', ') || '',
    seats: initial?.seats || 4,
    transmission: initial?.transmission || 'Automatic',
    fuel: initial?.fuel || 'Petrol',
    rating: initial?.rating || 0,
    available: initial?.available !== false,
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await uploadApi.upload(base64, 'carCRM/vehicles');
      setForm((f) => ({ ...f, images: [...f.images, result.url] }));
      toast.success('Image uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      type: form.type as Vehicle['type'],
      description: form.description,
      pricePerDay: Number(form.pricePerDay),
      pricePerHour: Number(form.pricePerHour),
      images: form.images,
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
      seats: Number(form.seats),
      transmission: form.transmission,
      fuel: form.fuel,
      rating: Number(form.rating),
      available: form.available,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium">Tên xe *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Loại xe</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Vehicle['type'] })}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none">
            <option value="car">Sedan</option>
            <option value="suv">SUV</option>
            <option value="luxury">Sang trọng</option>
            <option value="bike">Xe máy</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Mô tả</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium">VNĐ/Ngày</label>
          <input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">VNĐ/Giờ</label>
          <input type="number" value={form.pricePerHour} onChange={(e) => setForm({ ...form, pricePerHour: Number(e.target.value) })}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Chỗ ngồi</label>
          <input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium">Hộp số</label>
          <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none">
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Nhiên liệu</label>
          <select value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none">
            <option>Xăng</option>
            <option>Dầu</option>
            <option>Điện</option>
            <option>Hybrid</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Đánh giá</label>
          <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Tính năng (cách nhau bởi dấu phẩy)</label>
        <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
          placeholder="Autopilot, Premium Sound, ..."
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Hình ảnh</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.images.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} alt="" className="h-16 w-20 rounded-lg object-cover" />
              <button type="button" onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                className="absolute -top-1 -right-1 rounded-full bg-destructive p-0.5 text-white">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border p-2 text-xs text-muted-foreground hover:border-primary hover:text-primary">
          <Upload className="h-4 w-4" />
          {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
        </label>
        <div className="mt-2">
          <input placeholder="Hoặc dán URL ảnh và nhấn Enter" onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const url = (e.target as HTMLInputElement).value.trim();
              if (url) {
                setForm((f) => ({ ...f, images: [...f.images, url] }));
                (e.target as HTMLInputElement).value = '';
              }
            }
          }}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          {loading ? 'Đang lưu...' : initial ? 'Cập nhật' : 'Tạo mới'}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg bg-secondary px-4 py-2.5 text-sm">Huỷ</button>
      </div>
    </form>
  );
};

// ─── Blog Form Component ─────────────────────────────────
interface BlogFormProps {
  initial?: BlogPost;
  onSubmit: (data: Omit<BlogPost, 'id' | 'date'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const BlogForm = ({ initial, onSubmit, onCancel, loading }: BlogFormProps) => {
  const [form, setForm] = useState({
    title: initial?.title || '',
    excerpt: initial?.excerpt || '',
    content: initial?.content || '',
    image: initial?.image || '',
    author: initial?.author || '',
    readTime: initial?.readTime || '5 min read',
    category: initial?.category || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium">Tiêu đề *</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Tóm tắt</label>
        <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Nội dung *</label>
        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} required
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium">Tác giả</label>
          <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Danh mục</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Thời gian đọc</label>
          <input value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">URL hình ảnh</label>
        <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:border-primary focus:outline-none" />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          {loading ? 'Đang lưu...' : initial ? 'Cập nhật' : 'Tạo mới'}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg bg-secondary px-4 py-2.5 text-sm">Huỷ</button>
      </div>
    </form>
  );
};

// ─── Main Admin Page ─────────────────────────────────────
const Admin = () => {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [adminSecret, setAdminSecret] = useState(localStorage.getItem('adminSecret') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminSecret'));
  const [secretInput, setSecretInput] = useState('');

  // Vehicle form state
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>();
  // Blog form state
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | undefined>();

  // Hooks
  const { data: vehicles = [], isLoading: loadingVehicles } = useVehicles();
  const { data: bookings = [], isLoading: loadingBookings } = useBookings();
  const { data: blogs = [], isLoading: loadingBlogs } = useBlogPosts();

  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const updateBookingStatus = useUpdateBookingStatus();

  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();
  const deleteBlogPost = useDeleteBlogPost();

  const [seeding, setSeeding] = useState(false);

  const tabs = [
    { id: "dashboard" as Tab, label: "Tổng quan", icon: LayoutDashboard },
    { id: "vehicles" as Tab, label: "Xe", icon: Car },
    { id: "bookings" as Tab, label: "Đơn đặt", icon: CalendarDays },
    { id: "blog" as Tab, label: "Blog", icon: BookOpen },
  ];

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  // Auth
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('adminSecret', secretInput);
    setAdminSecret(secretInput);
    setIsAuthenticated(true);
    toast.success('Admin secret saved');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSecret');
    setAdminSecret('');
    setIsAuthenticated(false);
    toast.info('Logged out');
  };

  // Seed
  const handleSeed = async () => {
    if (!confirm('This will replace ALL data in the database with seed data. Continue?')) return;
    setSeeding(true);
    try {
      const result = await seedApi.seed();
      toast.success(`Seeded: ${result.inserted.vehicles} vehicles, ${result.inserted.bookings} bookings, ${result.inserted.blogPosts} posts`);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || 'Seed failed');
    } finally {
      setSeeding(false);
    }
  };

  // Vehicle handlers
  const handleVehicleSubmit = async (data: Omit<Vehicle, 'id'>) => {
    try {
      if (editingVehicle) {
        await updateVehicle.mutateAsync({ id: editingVehicle.id, data });
        toast.success('Vehicle updated');
      } else {
        await createVehicle.mutateAsync(data);
        toast.success('Vehicle created');
      }
      setShowVehicleForm(false);
      setEditingVehicle(undefined);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Delete this vehicle?')) return;
    try {
      await deleteVehicle.mutateAsync(id);
      toast.success('Vehicle deleted');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Booking handler
  const handleBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      await updateBookingStatus.mutateAsync({ id, status });
      toast.success(`Booking ${status}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Blog handlers
  const handleBlogSubmit = async (data: Omit<BlogPost, 'id' | 'date'>) => {
    try {
      if (editingBlog) {
        await updateBlogPost.mutateAsync({ id: editingBlog.id, data });
        toast.success('Post updated');
      } else {
        await createBlogPost.mutateAsync(data);
        toast.success('Post created');
      }
      setShowBlogForm(false);
      setEditingBlog(undefined);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await deleteBlogPost.mutateAsync(id);
      toast.success('Post deleted');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-xl bg-card p-6 card-shadow"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mb-1 text-center font-display text-xl font-bold">Đăng nhập Admin</h2>
          <p className="mb-4 text-center text-xs text-muted-foreground">Nhập mật khẩu admin để truy cập bảng điều khiển</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              placeholder="Mật khẩu admin..."
              className="mb-3 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
            <button type="submit"
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground">
              Đăng nhập
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-20 md:pb-8">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h1 className="mb-1 font-display text-2xl font-bold">Quản trị</h1>
            <p className="text-sm text-muted-foreground">Quản lý đội xe & đơn đặt</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSeed} disabled={seeding}
              className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50">
              <Database className="h-3.5 w-3.5" />
              {seeding ? 'Seeding...' : 'Seed DB'}
            </button>
            <button onClick={handleLogout}
              className="rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-muted-foreground hover:text-destructive">
              Đăng xuất
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-secondary p-1 hide-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                tab === t.id
                  ? "bg-card text-foreground card-shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Dashboard */}
            {tab === "dashboard" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Tổng đơn", value: bookings.length, icon: CalendarDays, color: "text-primary" },
                    { label: "Chờ duyệt", value: pendingCount, icon: Clock, color: "text-warning" },
                    { label: "Doanh thu", value: formatVND(totalRevenue), icon: DollarSign, color: "text-success" },
                    { label: "Số xe", value: vehicles.length, icon: Car, color: "text-accent" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-card p-4 card-shadow">
                      <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
                      <div className="font-display text-xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-card p-4 card-shadow">
                  <h3 className="mb-3 font-display text-sm font-bold">Đơn đặt gần đây</h3>
                  {loadingBookings ? (
                    <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
                  ) : (
                    <div className="space-y-2">
                      {bookings.slice(0, 3).map((b) => {
                        const StatusIcon = statusIcons[b.status] || AlertCircle;
                        return (
                          <div key={b.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                            <div>
                              <div className="text-sm font-medium">{b.vehicleName}</div>
                              <div className="text-xs text-muted-foreground">{b.customerName}</div>
                            </div>
                            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[b.status]}`}>
                              <StatusIcon className="h-3 w-3" />
                              {b.status}
                            </span>
                          </div>
                        );
                      })}
                      {bookings.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">Chưa có đơn đặt</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vehicles */}
            {tab === "vehicles" && (
              <div className="space-y-3">
                {showVehicleForm ? (
                  <div className="rounded-xl bg-card p-4 card-shadow">
                    <h3 className="mb-3 font-display text-sm font-bold">
                      {editingVehicle ? 'Sửa xe' : 'Thêm xe mới'}
                    </h3>
                    <VehicleForm
                      initial={editingVehicle}
                      onSubmit={handleVehicleSubmit}
                      onCancel={() => { setShowVehicleForm(false); setEditingVehicle(undefined); }}
                      loading={createVehicle.isPending || updateVehicle.isPending}
                    />
                  </div>
                ) : (
                  <button onClick={() => { setEditingVehicle(undefined); setShowVehicleForm(true); }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                    <Plus className="h-4 w-4" /> Thêm xe mới
                  </button>
                )}
                {loadingVehicles ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : vehicles.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 rounded-xl bg-card p-3 card-shadow">
                    <img src={v.images[0] || 'https://placehold.co/80x64?text=No+Image'} alt={v.name} className="h-16 w-20 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{v.name}</div>
                      <div className="text-xs text-muted-foreground">{formatVND(v.pricePerDay)}/ngày · {v.type}</div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingVehicle(v); setShowVehicleForm(true); }}
                        className="rounded-lg bg-secondary p-2 text-muted-foreground hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDeleteVehicle(v.id)}
                        className="rounded-lg bg-secondary p-2 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bookings */}
            {tab === "bookings" && (
              <div className="space-y-3">
                {loadingBookings ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : bookings.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-12">Chưa có đơn đặt</p>
                ) : bookings.map((b) => {
                  const StatusIcon = statusIcons[b.status] || AlertCircle;
                  return (
                    <div key={b.id} className="rounded-xl bg-card p-4 card-shadow">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-semibold">{b.vehicleName}</div>
                        <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[b.status]}`}>
                          <StatusIcon className="h-3 w-3" />
                          {b.status}
                        </span>
                      </div>
                      <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>Khách: {b.customerName}</div>
                        <div>SĐT: {b.customerPhone}</div>
                        <div>Từ: {b.startDate}</div>
                        <div>Đến: {b.endDate}</div>
                      </div>
                      <div className="mb-1 text-[11px] text-muted-foreground">
                        Đặt lúc: {formatDateTime(b.createdAt)}
                      </div>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-bold">{formatVND(b.totalPrice)}</span>
                        <span className="text-xs text-muted-foreground">ID: {b.id.slice(-6)}</span>
                      </div>
                      {b.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBookingStatus(b.id, "confirmed")}
                            disabled={updateBookingStatus.isPending}
                            className="flex-1 rounded-lg bg-success/10 py-2 text-xs font-medium text-success hover:bg-success/20 disabled:opacity-50"
                          >
                            Xác nhận
                          </button>
                          <button
                            onClick={() => handleBookingStatus(b.id, "cancelled")}
                            disabled={updateBookingStatus.isPending}
                            className="flex-1 rounded-lg bg-destructive/10 py-2 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
                          >
                            Huỷ
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Blog */}
            {tab === "blog" && (
              <div className="space-y-3">
                {showBlogForm ? (
                  <div className="rounded-xl bg-card p-4 card-shadow">
                    <h3 className="mb-3 font-display text-sm font-bold">
                      {editingBlog ? 'Sửa bài' : 'Tạo bài mới'}
                    </h3>
                    <BlogForm
                      initial={editingBlog}
                      onSubmit={handleBlogSubmit}
                      onCancel={() => { setShowBlogForm(false); setEditingBlog(undefined); }}
                      loading={createBlogPost.isPending || updateBlogPost.isPending}
                    />
                  </div>
                ) : (
                  <button onClick={() => { setEditingBlog(undefined); setShowBlogForm(true); }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                    <Plus className="h-4 w-4" /> Tạo bài mới
                  </button>
                )}
                {loadingBlogs ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : blogs.map((post) => (
                  <div key={post.id} className="flex items-center gap-3 rounded-xl bg-card p-3 card-shadow">
                    <img src={post.image || 'https://placehold.co/80x64?text=No+Image'} alt={post.title} className="h-16 w-20 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{post.title}</div>
                      <div className="text-xs text-muted-foreground">{post.author} · {post.date}</div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingBlog(post); setShowBlogForm(true); }}
                        className="rounded-lg bg-secondary p-2 text-muted-foreground hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDeleteBlog(post.id)}
                        className="rounded-lg bg-secondary p-2 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
