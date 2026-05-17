import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Edit2, Save, X, Search, Library, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SecurityPrompt } from '../../../worker/types';
export function PromptsManagement() {
  const prompts = useStore(s => s.prompts);
  const adminSavePrompt = useStore(s => s.adminSavePrompt);
  const adminDeletePrompt = useStore(s => s.adminDeletePrompt);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingPrompt, setEditingPrompt] = useState<SecurityPrompt | null>(null);
  const [formData, setFormData] = useState<Partial<SecurityPrompt>>({
    title: '',
    description: '',
    promptText: '',
    category: 'AUDIT'
  });
  const handleOpenDialog = (p?: SecurityPrompt) => {
    if (p) {
      setEditingPrompt(p);
      setFormData(p);
    } else {
      setEditingPrompt(null);
      setFormData({
        id: crypto.randomUUID(),
        title: '',
        description: '',
        promptText: '',
        category: 'AUDIT'
      });
    }
    setIsDialogOpen(true);
  };
  const handleSave = async () => {
    if (!formData.title || !formData.promptText) {
      toast.error("Title and Prompt Text are required");
      return;
    }
    const success = await adminSavePrompt(formData as SecurityPrompt);
    if (success) {
      toast.success(editingPrompt ? "Prompt updated" : "Prompt created");
      setIsDialogOpen(false);
    } else {
      toast.error("Failed to save tactical prompt");
    }
  };
  const handleDelete = async (id: string) => {
    if (confirm("Permanently wipe this tactical prompt from the library?")) {
      const success = await adminDeletePrompt(id);
      if (success) toast.success("Prompt purged");
      else toast.error("Purge failed");
    }
  };
  const filteredPrompts = prompts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Library className="w-6 h-6 text-primary" /> Intelligence Library CRUD
            </CardTitle>
            <CardDescription>Manage the tactical prompt gallery for security operators.</CardDescription>
          </div>
          <div className="flex gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search library..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background border-border"
              />
            </div>
            <Button type="button" onClick={() => handleOpenDialog()} className="bg-primary text-primary-foreground font-bold gap-2">
              <Plus className="w-4 h-4" /> Add Prompt
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="pl-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</TableHead>
              <TableHead className="text-right pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrompts.map((p) => (
              <TableRow key={p.id} className="border-border hover:bg-muted/30 transition-colors">
                <TableCell className="pl-6 py-4 font-bold text-foreground italic uppercase tracking-tight">{p.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[9px] font-black">{p.category}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-md truncate">{p.description}</TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(p)}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredPrompts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 text-muted-foreground font-medium uppercase tracking-widest text-xs">
                  No tactical payloads found in current environment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPrompt ? "Modify Payload" : "New Tactical Payload"}</DialogTitle>
            <DialogDescription>Define a specialized security research prompt for the library.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Prompt Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="SQLi Depth Scan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Tactical Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPLOIT">EXPLOIT</SelectItem>
                    <SelectItem value="AUDIT">AUDIT</SelectItem>
                    <SelectItem value="RECON">RECON</SelectItem>
                    <SelectItem value="DEFENSE">DEFENSE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Short Description</Label>
              <Input id="desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Analyze endpoints for blind SQL injection vectors." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Tactical Prompt Text</Label>
              <Textarea
                id="text"
                rows={6}
                className="font-mono text-sm"
                value={formData.promptText}
                onChange={(e) => setFormData({ ...formData, promptText: e.target.value })}
                placeholder="Analyze the following parameters for vulnerability vectors..."
              />
              <p className="text-[10px] text-muted-foreground uppercase font-bold italic">This text will auto-fill the operator's console input.</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSave} className="font-bold gap-2">
              <Save className="w-4 h-4" /> Commit to Library
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}