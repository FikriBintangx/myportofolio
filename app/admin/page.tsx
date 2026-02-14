'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Save, User, Layers, Database, Briefcase, Plus, Trash2, Image as ImageIcon, ExternalLink, Calendar, Smartphone, ArrowLeft } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const router = useRouter();
    const supabase = createClient();

    interface Profile {
        id: string | number | null;
        full_name: string;
        role: string;
        bio: string;
        location: string;
        status: string;
        whatsapp: string;
    }

    // Profile Form State
    const [profile, setProfile] = useState<Profile>({
        id: null,
        full_name: '',
        role: '',
        bio: '',
        location: '',
        status: '',
        whatsapp: ''
    });

    interface Project {
        id?: string | number;
        title: string;
        description: string;
        thumbnail_url: string;
        project_date: string;
        category: string;
        link: string;
        image_urls?: string[];
        order?: number;
    }

    // Projects State
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isAddingProject, setIsAddingProject] = useState(false);
    const [addingProjectData, setAddingProjectData] = useState<Project>({
        title: '',
        description: '',
        thumbnail_url: '',
        project_date: '',
        category: '',
        link: ''
    });

    interface Gear {
        id?: string | number;
        name: string;
        description: string;
        image_url: string;
        sequence_path: string;
        frame_count: number;
        start_frame: number;
        is_active: boolean;
        is_pinned: boolean;
        order: number;
    }

    // Gear (Devices) State
    const [gear, setGear] = useState<Gear[]>([]);
    const [editingGear, setEditingGear] = useState<Gear | null>(null);
    const [isAddingGear, setIsAddingGear] = useState(false);
    const [addingGearData, setAddingGearData] = useState<Gear>({
        name: '',
        description: '',
        image_url: '',
        sequence_path: '',
        frame_count: 0,
        start_frame: 0,
        is_active: true,
        is_pinned: false,
        order: 0
    });

    // CV State
    const [cvUrl, setCvUrl] = useState('');

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // router.push('/login'); 
            }
            setLoading(false);
            fetchProfile();
            fetchContent();
            fetchProjects();
            fetchGear();
        };

        checkUser();
    }, []);

    const fetchProfile = async () => {
        const { data } = await supabase.from('profile').select('*').single();
        if (data) setProfile(data);
    };

    const fetchContent = async () => {
        const { data } = supabase.storage.from('documents').getPublicUrl('cv.pdf');
        if (data) setCvUrl(data.publicUrl);
    };

    const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const { error } = await supabase.storage.from('documents').upload('cv.pdf', file, { upsert: true });
        if (!error) {
            alert('CV uploaded successfully!');
            fetchContent();
        } else {
            alert('Error: ' + error.message);
        }
    };

    const fetchProjects = async () => {
        const { data } = await supabase.from('projects').select('*').order('order', { ascending: true });
        if (data) setProjects(data);
    };

    const handleProjectSave = async (project: any) => {
        const { id, ...projectData } = project;
        if (id) {
            const { error } = await supabase.from('projects').update(projectData).eq('id', id);
            if (!error) {
                alert('Project updated!');
                setEditingProject(null);
                fetchProjects();
            }
        } else {
            const { error } = await supabase.from('projects').insert([projectData]);
            if (!error) {
                alert('Project added!');
                setIsAddingProject(false);
                fetchProjects();
            }
        }
    };

    const handleProjectDelete = async (id: any) => {
        if (confirm('Delete this project?')) {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (!error) fetchProjects();
        }
    };

    const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        // Handle multiple files if selected, effectively just processing the first one for now as logic is per-file upload usually 
        // but let's loop if user selects multiple
        const files = Array.from(e.target.files);
        const newUrls: string[] = [];

        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `project-images/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);

            if (uploadError) {
                alert(`Error uploading ${file.name}: ${uploadError.message}`);
                continue;
            }

            const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath);
            newUrls.push(publicUrl);
        }

        if (newUrls.length === 0) return;

        // Helper to append URLs
        const updateState = (prevState: Project) => {
            const currentUrls = prevState.thumbnail_url ? prevState.thumbnail_url.split(',').map(u => u.trim()).filter(Boolean) : [];
            const combined = [...currentUrls, ...newUrls];
            // Limit to 4 if strictly needed, but flexible is better.
            return { ...prevState, thumbnail_url: combined.join(',') };
        };

        if (editingProject) {
            setEditingProject(updateState(editingProject));
        } else if (isAddingProject) {
            setAddingProjectData(updateState(addingProjectData));
        }
    };

    const removeProjectImage = (indexToRemove: number) => {
        const updateState = (prevState: Project) => {
            const currentUrls = prevState.thumbnail_url ? prevState.thumbnail_url.split(',').map(u => u.trim()).filter(Boolean) : [];
            const filtered = currentUrls.filter((_, idx) => idx !== indexToRemove);
            return { ...prevState, thumbnail_url: filtered.join(',') };
        };

        if (editingProject) {
            setEditingProject(updateState(editingProject));
        } else if (isAddingProject) {
            setAddingProjectData(updateState(addingProjectData));
        }
    };
    const [isUploadingSequence, setIsUploadingSequence] = useState(false);

    const handleSequenceZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const name = editingGear ? editingGear.name : addingGearData.name;

        if (!name) {
            alert('Please enter a device name first');
            return;
        }

        setIsUploadingSequence(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('deviceName', name);

        try {
            const res = await fetch('/api/upload-sequence', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                if (editingGear) setEditingGear({ ...editingGear, sequence_path: data.sequencePath, frame_count: data.frameCount });
                else setAddingGearData({ ...addingGearData, sequence_path: data.sequencePath, frame_count: data.frameCount });
                alert(`Sequence uploaded! ${data.frameCount} frames processed.`);
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err: any) {
            alert('Upload failed: ' + err.message);
        } finally {
            setIsUploadingSequence(false);
        }
    };

    const fetchGear = async () => {
        const { data } = await supabase.from('gear').select('*').order('order', { ascending: true });
        if (data) setGear(data);
    };

    const handleGearSave = async (item: any) => {
        const { id, ...dataToSave } = item;

        if (id) {
            const { error } = await supabase.from('gear').update(dataToSave).eq('id', id);
            if (!error) {
                alert('Device updated!');
                setEditingGear(null);
                fetchGear();
            } else {
                alert('Update Error: ' + error.message);
            }
        } else {
            const { error } = await supabase.from('gear').insert([dataToSave]);
            if (!error) {
                alert('Device added!');
                setIsAddingGear(false);
                fetchGear();
            } else {
                alert('Insert Error: ' + error.message);
            }
        }
    };

    const handleGearDelete = async (id: any) => {
        if (confirm('Delete this device?')) {
            const { error } = await supabase.from('gear').delete().eq('id', id);
            if (!error) fetchGear();
        }
    };



    const updateProfile = async () => {
        const { id, ...updateData } = profile;
        const { error } = await supabase.from('profile').update(updateData).eq('id', id);
        if (!error) alert('Profile updated successfully!');
        else alert('Error updating profile: ' + error.message);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading System...</div>;

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
                <h1 className="text-2xl font-bold tracking-tighter mb-10">IS4GI<span className="text-white/40">.admin</span></h1>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-white text-black' : 'hover:bg-white/5 text-white/60'}`}
                    >
                        <User size={18} />
                        <span className="font-medium">Profile</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'content' ? 'bg-white text-black' : 'hover:bg-white/5 text-white/60'}`}
                    >
                        <Layers size={18} />
                        <span className="font-medium">Content</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'projects' ? 'bg-white text-black' : 'hover:bg-white/5 text-white/60'}`}
                    >
                        <Briefcase size={18} />
                        <span className="font-medium">Projects</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('devices')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'devices' ? 'bg-white text-black' : 'hover:bg-white/5 text-white/60'}`}
                    >
                        <Smartphone size={18} />
                        <span className="font-medium">Devices</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('data')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'data' ? 'bg-white text-black' : 'hover:bg-white/5 text-white/60'}`}
                    >
                        <Database size={18} />
                        <span className="font-medium">Database</span>
                    </button>
                </nav>

                <div className="mt-auto space-y-4">
                    <MagneticButton>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-4 py-3 rounded-xl transition-all border border-white/5"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-sm font-medium">Back to Site</span>
                        </button>
                    </MagneticButton>

                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500/60 hover:text-red-500 transition-colors">
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto">
                {activeTab === 'profile' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
                        <h2 className="text-3xl font-bold mb-8">Edit Profile</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Full Name</label>
                                <input
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-white/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Role Title</label>
                                <input
                                    value={profile.role}
                                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-white/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Bio (HTML Supported)</label>
                                <textarea
                                    rows={4}
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-white/50 font-mono text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Location</label>
                                    <input
                                        value={profile.location}
                                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-white/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Status</label>
                                    <input
                                        value={profile.status}
                                        onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-white/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">WhatsApp Number</label>
                                <input
                                    value={profile.whatsapp || ''}
                                    onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-white/50"
                                    placeholder="e.g. 0812 9287 0932"
                                />
                                <p className="text-[10px] text-white/30 mt-2">Format: 08xx or +62xx (will be converted to wa.me link)</p>
                            </div>

                            <button
                                onClick={updateProfile}
                                className="flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'content' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
                        <h2 className="text-3xl font-bold mb-8">Content Management</h2>

                        <div className="space-y-8 bg-zinc-900/30 p-8 rounded-2xl border border-white/5">
                            <div>
                                <h3 className="text-lg font-medium mb-4">Curriculum Vitae (PDF)</h3>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleCvUpload}
                                        className="hidden"
                                        id="cv-upload"
                                    />
                                    <label
                                        htmlFor="cv-upload"
                                        className="bg-white text-black font-bold px-6 py-3 rounded-lg cursor-pointer hover:bg-zinc-200 transition-colors"
                                    >
                                        Upload New CV
                                    </label>
                                    {cvUrl && <span className="text-xs text-white/40">Current CV Active</span>}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <h3 className="text-lg font-medium mb-4">Navbar Menu</h3>
                                <p className="text-white/40 text-sm">Menu items are currently managed via the nav_links table.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
                {activeTab === 'projects' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold">Projects Manager</h2>
                            <button
                                onClick={() => setIsAddingProject(true)}
                                className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
                            >
                                <Plus size={18} /> Add Project
                            </button>
                        </div>

                        {/* Projects List */}
                        {!isAddingProject && !editingProject && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <div key={project.id} className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden group">
                                        <div className="aspect-video bg-zinc-800 relative">
                                            {project.thumbnail_url ? (
                                                <img src={project.thumbnail_url.split(',')[0].trim()} alt={project.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/20">No Thumbnail</div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                            <p className="text-white/40 text-sm line-clamp-2 mb-4">{project.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    <button onClick={() => setEditingProject(project)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white/60 transition-colors">
                                                        <Layers size={16} />
                                                    </button>
                                                    <button onClick={() => handleProjectDelete(project.id)} className="p-2 bg-white/5 rounded-lg hover:bg-red-500/10 text-red-500/60 hover:text-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <span className="text-[10px] uppercase tracking-widest text-white/20">{project.project_date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add/Edit Form Overlay-ish */}
                        {(isAddingProject || editingProject) && (
                            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
                                <h3 className="text-2xl font-bold mb-8">{editingProject ? 'Edit Project' : 'New Project'}</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Title</label>
                                            <input
                                                value={editingProject ? editingProject.title : addingProjectData.title}
                                                onChange={(e) => editingProject ? setEditingProject({ ...editingProject, title: e.target.value }) : setAddingProjectData({ ...addingProjectData, title: e.target.value })}
                                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-white/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Category</label>
                                            <input
                                                value={editingProject ? editingProject.category : addingProjectData.category}
                                                onChange={(e) => editingProject ? setEditingProject({ ...editingProject, category: e.target.value }) : setAddingProjectData({ ...addingProjectData, category: e.target.value })}
                                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-white/30"
                                                placeholder="e.g. Mobile App, Web Design"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Description</label>
                                            <textarea
                                                rows={4}
                                                value={editingProject ? editingProject.description : addingProjectData.description}
                                                onChange={(e) => editingProject ? setEditingProject({ ...editingProject, description: e.target.value }) : setAddingProjectData({ ...addingProjectData, description: e.target.value })}
                                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-white/30"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <div>
                                                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Project Images (Max 4 recommended)</label>

                                                {/* Image Grid */}
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    {((editingProject ? editingProject.thumbnail_url : addingProjectData.thumbnail_url) || '').split(',').map((url, idx) => {
                                                        const cleanUrl = url.trim();
                                                        if (!cleanUrl) return null;
                                                        return (
                                                            <div key={idx} className="aspect-video bg-black border border-white/10 rounded-xl overflow-hidden relative group">
                                                                <img src={cleanUrl} className="w-full h-full object-cover" />
                                                                <button
                                                                    onClick={() => removeProjectImage(idx)}
                                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}

                                                    {/* Upload Button */}
                                                    <label className="aspect-video bg-black/40 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group">
                                                        <div className="bg-white/10 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                                            <Plus size={20} className="text-white/60" />
                                                        </div>
                                                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Add Image</span>
                                                        <input
                                                            type="file"
                                                            onChange={handleProjectImageUpload}
                                                            className="hidden"
                                                            accept="image/*"
                                                            multiple
                                                        />
                                                    </label>
                                                </div>
                                                <p className="text-[10px] text-white/30">First image is the main cover. Upload up to 3 for collage layout, 4+ for grid.</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Completion Date</label>
                                                    <input
                                                        value={editingProject ? editingProject.project_date : addingProjectData.project_date}
                                                        onChange={(e) => editingProject ? setEditingProject({ ...editingProject, project_date: e.target.value }) : setAddingProjectData({ ...addingProjectData, project_date: e.target.value })}
                                                        placeholder="Feb 2024"
                                                        className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-white/30"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">External Link</label>
                                                    <input
                                                        value={editingProject ? editingProject.link : addingProjectData.link}
                                                        onChange={(e) => editingProject ? setEditingProject({ ...editingProject, link: e.target.value }) : setAddingProjectData({ ...addingProjectData, link: e.target.value })}
                                                        placeholder="https://..."
                                                        className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-white/30"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-10">
                                    <button
                                        onClick={() => handleProjectSave(editingProject ? editingProject : addingProjectData)}
                                        className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} /> {editingProject ? 'Update Project' : 'Publish Project'}
                                    </button>
                                    <button
                                        onClick={() => { setIsAddingProject(false); setEditingProject(null); }}
                                        className="px-8 bg-zinc-800 text-white font-bold py-4 rounded-xl hover:bg-zinc-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
                {activeTab === 'devices' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold">Devices Manager</h2>
                            <button
                                onClick={() => setIsAddingGear(true)}
                                className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
                            >
                                <Plus size={18} /> Add Device
                            </button>
                        </div>

                        {/* Gear List */}
                        {!isAddingGear && !editingGear && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {gear.map((item) => (
                                    <div key={item.id} className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden group">
                                        <div className="aspect-square bg-zinc-800 relative">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-contain p-4" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                                            <p className="text-white/40 text-sm line-clamp-2 mb-4">{item.description}</p>
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingGear(item)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white/60 transition-colors">
                                                    <Layers size={16} />
                                                </button>
                                                <button onClick={() => handleGearDelete(item.id)} className="p-2 bg-white/5 rounded-lg hover:bg-red-500/10 text-red-500/60 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add/Edit Form */}
                        {(isAddingGear || editingGear) && (
                            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
                                <h3 className="text-2xl font-bold mb-8">{editingGear ? 'Edit Device' : 'New Device'}</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Device Name</label>
                                        <input
                                            value={editingGear ? editingGear.name : addingGearData.name}
                                            onChange={(e) => editingGear ? setEditingGear({ ...editingGear, name: e.target.value }) : setAddingGearData({ ...addingGearData, name: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-white/30"
                                            placeholder="e.g. MacBook Pro M3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Description</label>
                                        <input
                                            value={editingGear ? editingGear.description : addingGearData.description}
                                            onChange={(e) => editingGear ? setEditingGear({ ...editingGear, description: e.target.value }) : setAddingGearData({ ...addingGearData, description: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-white/30"
                                            placeholder="e.g. 14-inch, Space Black"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Device Photo (Thumbnail)</label>
                                            <div className="aspect-square w-full bg-black border border-white/10 rounded-xl overflow-hidden relative group">
                                                {(editingGear?.image_url || addingGearData.image_url) ? (
                                                    <img src={editingGear ? editingGear.image_url : addingGearData.image_url} className="w-full h-full object-contain p-2" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/20">
                                                        <ImageIcon size={32} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-bold text-sm">
                                                        Upload
                                                        <input type="file" onChange={(e) => {
                                                            const upload = async () => {
                                                                if (!e.target.files || e.target.files.length === 0) return;
                                                                const file = e.target.files[0];
                                                                const fileExt = file.name.split('.').pop();
                                                                const fileName = `${Math.random()}.${fileExt}`;
                                                                const filePath = `gear-images/${fileName}`;
                                                                const { error } = await supabase.storage.from('documents').upload(filePath, file);
                                                                if (error) { alert(error.message); return; }
                                                                const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath);
                                                                if (editingGear) setEditingGear({ ...editingGear, image_url: publicUrl });
                                                                else setAddingGearData({ ...addingGearData, image_url: publicUrl });
                                                            };
                                                            upload();
                                                        }} className="hidden" accept="image/*" />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Image Sequence (ZIP)</label>
                                            <div className="aspect-square w-full bg-black border border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-center space-y-4">
                                                <Database size={40} className={isUploadingSequence ? "animate-pulse text-white" : "text-white/20"} />
                                                <div>
                                                    <p className="text-sm font-bold text-white">
                                                        {(editingGear?.sequence_path || addingGearData.sequence_path) ? 'Sequence Uploaded' : 'Upload ZIP Sequence'}
                                                    </p>
                                                    <p className="text-[10px] text-white/40 mt-1">
                                                        {(editingGear?.frame_count || addingGearData.frame_count) || 0} frames detected
                                                    </p>
                                                </div>
                                                <label className={`cursor-pointer px-6 py-3 rounded-full font-bold text-xs transition-colors ${isUploadingSequence ? 'bg-white/10 text-white/20 pointer-events-none' : 'bg-white text-black hover:bg-zinc-200'}`}>
                                                    {isUploadingSequence ? 'Extracting...' : 'Select ZIP'}
                                                    <input type="file" accept=".zip" onChange={handleSequenceZipUpload} className="hidden" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-black/20 border border-white/5 rounded-xl p-4 mt-4">
                                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Start Frame Index</label>
                                        <input
                                            type="number"
                                            value={editingGear ? (editingGear.start_frame || 0) : addingGearData.start_frame}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                editingGear ? setEditingGear({ ...editingGear, start_frame: val }) : setAddingGearData({ ...addingGearData, start_frame: val });
                                            }}
                                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-white/30"
                                            placeholder="e.g. 0 or 108"
                                        />
                                        <p className="text-[10px] text-white/30 mt-2">The frame index where the scroll animation starts (useful for pre-roll).</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div
                                            onClick={() => {
                                                const val = editingGear ? !editingGear.is_active : !addingGearData.is_active;
                                                editingGear ? setEditingGear({ ...editingGear, is_active: val }) : setAddingGearData({ ...addingGearData, is_active: val });
                                            }}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${(editingGear ? editingGear.is_active : addingGearData.is_active) ? 'bg-white/10 border-white/20 text-white' : 'bg-black/40 border-white/5 text-white/40'}`}
                                        >
                                            <span className="text-xs font-bold uppercase tracking-widest">Active Status</span>
                                            <div className={`w-10 h-5 rounded-full relative transition-colors ${(editingGear ? editingGear.is_active : addingGearData.is_active) ? 'bg-green-500' : 'bg-zinc-700'}`}>
                                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${(editingGear ? editingGear.is_active : addingGearData.is_active) ? 'right-1' : 'left-1'}`} />
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => {
                                                const val = editingGear ? !editingGear.is_pinned : !addingGearData.is_pinned;
                                                editingGear ? setEditingGear({ ...editingGear, is_pinned: val }) : setAddingGearData({ ...addingGearData, is_pinned: val });
                                            }}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${(editingGear ? editingGear.is_pinned : addingGearData.is_pinned) ? 'bg-blue-500/10 border-blue-500/50 text-blue-200' : 'bg-black/40 border-white/5 text-white/40'}`}
                                        >
                                            <span className="text-xs font-bold uppercase tracking-widest">View on Preview</span>
                                            <div className={`w-10 h-5 rounded-full relative transition-colors ${(editingGear ? editingGear.is_pinned : addingGearData.is_pinned) ? 'bg-blue-500' : 'bg-zinc-700'}`}>
                                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${(editingGear ? editingGear.is_pinned : addingGearData.is_pinned) ? 'right-1' : 'left-1'}`} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-black/20 border border-white/5 rounded-xl p-4 mt-4">
                                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Display Order</label>
                                        <input
                                            type="number"
                                            value={editingGear ? (editingGear.order || 0) : addingGearData.order}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                editingGear ? setEditingGear({ ...editingGear, order: val }) : setAddingGearData({ ...addingGearData, order: val });
                                            }}
                                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-white/30"
                                            placeholder="Priority (low number = first)"
                                        />
                                        <p className="text-[10px] text-white/30 mt-2">Determines position (1 is top/first).</p>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            onClick={() => handleGearSave(editingGear ? editingGear : addingGearData)}
                                            className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Save size={18} /> {editingGear ? 'Update Device' : 'Add Device'}
                                        </button>
                                        <button
                                            onClick={() => { setIsAddingGear(false); setEditingGear(null); }}
                                            className="px-8 bg-zinc-800 text-white font-bold py-4 rounded-xl hover:bg-zinc-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
                {activeTab !== 'profile' && activeTab !== 'content' && activeTab !== 'projects' && activeTab !== 'devices' && (
                    <div className="flex items-center justify-center h-full text-white/20">Module Under Construction</div>
                )}
            </main>
        </div >
    );
}
