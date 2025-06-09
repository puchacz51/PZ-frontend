import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { LogOut, Upload, User, Settings } from "lucide-react";
import { useState } from "react";
import NewBadge from "@/components/ui/NewBadge";
import { userService } from "@/api/userService";

const SettingsPage = () => {
    const { user, logout, updateUserProfile } = useUser();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Walidacja rozmiaru pliku (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setUploadError("Plik jest za duży. Maksymalny rozmiar to 5MB.");
                return;
            }

            // Walidacja typu pliku
            if (!file.type.startsWith('image/')) {
                setUploadError("Nieprawidłowy typ pliku. Wybierz obraz.");
                return;
            }

            setAvatarFile(file);
            setUploadError(null);

            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    const handleAvatarSave = async () => {
        if (!avatarFile) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            await userService.uploadAvatar(avatarFile);
            await updateUserProfile();
            
            // 🎉 Czyszczenie stanu po udanym uploadu
            setAvatarFile(null);
            setPreviewUrl(null);
            
            console.log("✅ Avatar uploaded successfully");
        } catch (error: any) {
            console.error("❌ Avatar upload failed:", error);
            setUploadError(error.response?.data?.message || 'Nie udało się przesłać avatara');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAvatarDelete = async () => {
        if (!user?.avatarUrl) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            await userService.deleteAvatar();
            await updateUserProfile();
            
            console.log("🗑️ Avatar deleted successfully");
        } catch (error: any) {
            console.error("❌ Avatar delete failed:", error);
            setUploadError(error.response?.data?.message || 'Nie udało się usunąć avatara');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Ustawienia</h1>

            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl">
                <NewBadge />

                {/* Hero header with user info */}
                <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative">
                        <Avatar className="h-28 w-28 border-4 border-white/20 shadow-lg">
                            {previewUrl ? (
                                <AvatarImage src={previewUrl} alt="Preview" />
                            ) : user?.avatarUrl ? (
                                <AvatarImage src={user.avatarUrl} alt={user.firstName} />
                            ) : (
                                <AvatarFallback className="bg-white/20 text-white text-2xl font-semibold uppercase">
                                    {user?.firstName?.charAt(0)}
                                    {user?.lastName?.charAt(0)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 h-10 w-10 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-all shadow-md">
                            <Upload className="h-5 w-5 text-black" />
                        </label>
                        <Input 
                            id="avatar-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleAvatarChange}
                            disabled={isUploading}
                        />
                    </div>

                    <div className="text-center md:text-left md:flex-1">
                        <h2 className="text-2xl font-bold text-white">
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-white/70 text-lg">@{user?.login}</p>
                        <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                            <span className="text-sm bg-white/10 text-white/90 px-3 py-1 rounded-full">{user?.email}</span>
                            <span className="text-sm bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full">{user?.role}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Upload/Delete Avatar Section */}
                    {(previewUrl || user?.avatarUrl) && (
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-medium flex items-center">
                                        <Settings className="h-4 w-4 mr-2 text-white/70" />
                                        {previewUrl ? "Nowy avatar" : "Zarządzaj avatarem"}
                                    </h3>
                                    {previewUrl && (
                                        <p className="text-white/60 text-sm mt-1">{avatarFile?.name}</p>
                                    )}
                                    {uploadError && (
                                        <p className="text-red-400 text-sm mt-1">{uploadError}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {previewUrl && (
                                        <Button 
                                            onClick={handleAvatarSave} 
                                            disabled={isUploading}
                                            className="bg-white text-black hover:bg-white/80"
                                        >
                                            {isUploading ? "⏳ Zapisywanie..." : "💾 Zapisz avatar"}
                                        </Button>
                                    )}
                                    {user?.avatarUrl && !previewUrl && (
                                        <Button 
                                            onClick={handleAvatarDelete}
                                            disabled={isUploading}
                                            className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                                        >
                                            {isUploading ? "⏳ Usuwanie..." : "🗑️ Usuń avatar"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Info Section */}
                    <div>
                        <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2 mb-4 flex items-center">
                            <User className="h-5 w-5 mr-2 text-white/70" />
                            Informacje o koncie
                        </h3>

                        <div className="space-y-4 pl-2">
                            <div className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-white/70">Login</span>
                                <span className="text-white">{user?.login}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-white/70">Email</span>
                                <span className="text-white">{user?.email}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-white/70">Rola</span>
                                <span className="text-white">{user?.role}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/70">Data dołączenia</span>
                                <span className="text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Data nieznana"}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="mt-6 pl-2">
                            <Button onClick={logout} className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-red-300 w-full cursor-pointer" size="lg">
                                <LogOut className="mr-2 h-4 w-4" />
                                Wyloguj się
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
