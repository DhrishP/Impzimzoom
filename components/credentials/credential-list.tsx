"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { Credential } from "@prisma/client";
import { decryptPassword } from "@/lib/encryption";
import { useToast } from "@/hooks/use-toast";
import { SecretKeyModal } from "@/components/credentials/secret-key-modal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function CredentialList() {
  const { credentials = [], loading, refreshData, searchTerms, deleteData } = useData();
  const [showSecretKeyModal, setShowSecretKeyModal] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<string | null>(
    null
  );
  const [decryptedPasswords, setDecryptedPasswords] = useState<
    Record<string, string>
  >({});
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [credentialToDelete, setCredentialToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (typeof refreshData === 'function') {
      refreshData("credentials");
    }
  }, [refreshData]);

  const filteredCredentials = credentials?.filter(
    (credential) =>
      credential?.title
        ?.toLowerCase()
        ?.includes(searchTerms?.credentials?.toLowerCase() || '') ||
      credential?.username
        ?.toLowerCase()
        ?.includes(searchTerms?.credentials?.toLowerCase() || '') ||
      credential?.notes
        ?.toLowerCase()
        ?.includes(searchTerms?.credentials?.toLowerCase() || '')
  ) || [];

  const handleShowPassword = (id: string) => {
    if (decryptedPasswords[id]) {
      setDecryptedPasswords((prev) => {
        const newPasswords = { ...prev };
        delete newPasswords[id];
        return newPasswords;
      });
      return;
    }

    setSelectedCredential(id);
    setShowSecretKeyModal(true);
  };

  const handleDecrypt = (secretKey: string) => {
    if (!selectedCredential) return;

    try {
      const credential = credentials.find((c) => c.id === selectedCredential);
      if (!credential?.password || !secretKey) {
        throw new Error("Missing password or secret key");
      }

      const decryptedPassword = decryptPassword(credential.password, secretKey);
      
      if (!decryptedPassword) {
        throw new Error("Decryption failed");
      }

      setDecryptedPasswords((prev) => ({
        ...prev,
        [selectedCredential]: decryptedPassword,
      }));
    } catch (error) {
      console.error('Decryption error:', error);
      toast({
        title: "Decryption Error",
        description: "Failed to decrypt password. Please check your secret key.",
        variant: "destructive",
      });
    } finally {
      setShowSecretKeyModal(false);
      setSelectedCredential(null);
    }
  };

  const handleDelete = async (id: string) => {
    setCredentialToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!credentialToDelete) return;

    try {
      await deleteData("credentials", credentialToDelete);
      toast({
        title: "Success",
        description: "Credential deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete credential",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCredentialToDelete(null);
    }
  };

  if (loading.credentials) {
    return <div>Loading credentials...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {filteredCredentials.map((credential) => (
          <Card key={credential.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold">{credential.title}</h3>
                <div className="space-y-1 text-sm">
                  <p>Username: {credential.username}</p>
                  <div className="flex items-center gap-2">
                    <p>
                      Password:{" "}
                      {decryptedPasswords[credential.id] || "********"}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShowPassword(credential.id)}
                    >
                      {decryptedPasswords[credential.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {credential.url && (
                  <a
                    href={credential.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(credential.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {credential.notes && (
              <p className="mt-2 text-sm text-muted-foreground">
                {credential.notes}
              </p>
            )}
          </Card>
        ))}
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the credential.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <SecretKeyModal
        open={showSecretKeyModal}
        onOpenChange={setShowSecretKeyModal}
        onSubmit={handleDecrypt}
        action="decrypt"
      />
    </>
  );
}
