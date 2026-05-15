import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Save, X, Layers, Zap, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import type { PricingPackage } from '../../../worker/types';
export function PackagesManagement() {
  const packages = useStore(s => s.packages);
  const adminSavePackage = useStore(s => s.adminSavePackage);
  const adminDeletePackage = useStore(s => s.adminDeletePackage);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PricingPackage | null>(null);
  const [formData, setFormData] = useState<Partial<PricingPackage>>({
    name: '',
    price: '',
    description: '',
    credits: 0,
    features: [],
    isHighlight: false
  });
  const [newFeature, setNewFeature] = useState('');
  const handleOpenDialog = (pkg?: PricingPackage) => {
    if (pkg) {
      setEditingPkg(pkg);
      setFormData(pkg);
    } else {
      setEditingPkg(null);
      setFormData({
        id: crypto.randomUUID(),
        name: '',
        price: '',
        description: '',
        credits: 0,
        features: [],
        isHighlight: false
      });
    }
    setIsDialogOpen(true);
  };
  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      toast.error("Name and Price are required");
      return;
    }
    const success = await adminSavePackage(formData as PricingPackage);
    if (success) {
      toast.success(editingPkg ? "Package updated" : "Package created");
      setIsDialogOpen(false);
    } else {
      toast.error("Failed to save package");
    }
  };
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      const success = await adminDeletePackage(id);
      if (success) toast.success("Package deleted");
      else toast.error("Delete failed");
    }
  };
  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFormData({
      ...formData,
      features: [...(formData.features || []), newFeature.trim()]
    });
    setNewFeature('');
  };
  const removeFeature = (index: number) => {
    const next = [...(formData.features || [])];
    next.splice(index, 1);
    setFormData({ ...formData, features: next });
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Platform Tiers</h2>
          <p className="text-sm text-muted-foreground font-medium">Manage pricing, feature lists, and dynamic user credit limits.</p>
        </div>
        <Button 
          type="button" 
          onClick={() => handleOpenDialog()} 
          className="bg-primary text-primary-foreground font-bold gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" /> Add Package
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="bg-card border-border shadow-soft group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={pkg.isHighlight ? "default" : "outline"} className="uppercase text-[10px] tracking-widest font-black">
                  {pkg.isHighlight ? "Highlighted" : "Standard"}
                </Badge>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(pkg)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(pkg.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
              <CardDescription className="text-sm font-medium line-clamp-2 h-10">{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">${pkg.price}</span>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">/month</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted border border-border">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">{pkg.credits} Tokens Allocation</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Core Features</p>
                <ul className="space-y-1">
                  {pkg.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="text-[11px] text-foreground font-medium flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" /> {f}
                    </li>
                  ))}
                  {pkg.features.length > 3 && (
                    <li className="text-[10px] text-muted-foreground italic font-medium">+{pkg.features.length - 3} more features</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPkg ? "Edit Tier" : "New Pricing Tier"}</DialogTitle>
            <DialogDescription>Instant updates across public pricing and user limits.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Package Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Pro Vision" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Monthly Price ($)</Label>
                <Input id="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="29" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Short Description</Label>
              <Input id="desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="The ultimate builder's toolkit" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credits">Credit Limit (Tokens)</Label>
                <Input id="credits" type="number" value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 mt-6">
                <Label htmlFor="highlight" className="text-xs font-bold">Highlight Plan</Label>
                <Switch id="highlight" checked={formData.isHighlight} onCheckedChange={(val) => setFormData({ ...formData, isHighlight: val })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Features List</Label>
              <div className="flex gap-2">
                <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Add feature..." onKeyDown={(e) => e.key === 'Enter' && addFeature()} />
                <Button type="button" onClick={addFeature} variant="secondary"><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="max-h-[150px] overflow-y-auto space-y-1 mt-2">
                {formData.features?.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-muted border border-border">
                    <span className="text-[11px] font-medium">{f}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeFeature(i)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSave} className="font-bold gap-2">
              <Save className="w-4 h-4" /> Save Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}