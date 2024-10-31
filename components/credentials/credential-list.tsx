"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { Credential } from "@prisma/client";
import { decryptPassword } from "@/lib/encryption";
import { useToast } from "@/hooks/use-toast";
import { SecretKeyModal } from "@/components/credentials/secret-key-modal";

export function CredentialList() {
  const { credentials, loading, refreshData, searchTerms } = useData();
  const [showSecretKeyModal, setShowSecretKeyModal] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<string | null>(
    null
  );
  const [decryptedPasswords, setDecryptedPasswords] = useState<
    Record<string, string>
  >({});
  const { toast } = useToast();

  useEffect(() => {
    refreshData("credentials");
  }, [refreshData]);

  const filteredCredentials = credentials.filter(
    (credential) =>
      credential.title
        .toLowerCase()
        .includes(searchTerms.credentials.toLowerCase()) ||
      credential.username
        .toLowerCase()
        .includes(searchTerms.credentials.toLowerCase()) ||
      credential.notes
        ?.toLowerCase()
        .includes(searchTerms.credentials.toLowerCase())
  );

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
      if (!credential) return;

      const decryptedPassword = decryptPassword(credential.password, secretKey);
      setDecryptedPasswords((prev) => ({
        ...prev,
        [selectedCredential]: decryptedPassword,
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid secret key or corrupted password",
        variant: "destructive",
      });
    } finally {
      setShowSecretKeyModal(false);
      setSelectedCredential(null);
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
            </div>
            {credential.notes && (
              <p className="mt-2 text-sm text-muted-foreground">
                {credential.notes}
              </p>
            )}
          </Card>
        ))}
      </div>
      <SecretKeyModal
        open={showSecretKeyModal}
        onOpenChange={setShowSecretKeyModal}
        onSubmit={handleDecrypt}
        action="decrypt"
      />
    </>
  );
}
