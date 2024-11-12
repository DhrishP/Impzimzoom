"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { fetchData, postData } from "@/lib/api-utils";
import {
  EmailTemplate,
  Credential,
  Description,
  Task,
  ColdEmailData,
  TwitterBanger,
} from "@prisma/client";

interface DataContextType {
  emails: EmailTemplate[];
  credentials: Credential[];
  descriptions: Description[];
  tasks: Task[];
  coldEmails: ColdEmailData[];
  twitterBangers: TwitterBanger[];
  loading: Record<string, boolean>;
  searchTerms: Record<string, string>;
  setSearchTerm: (type: string, term: string) => void;
  refreshData: (
    type:
      | "emails"
      | "credentials"
      | "descriptions"
      | "tasks"
      | "coldEmails"
      | "twitterBangers"
  ) => Promise<void>;
  addData: (
    type:
      | "emails"
      | "credentials"
      | "descriptions"
      | "tasks"
      | "coldEmails"
      | "twitterBangers",
    data: Partial<EmailTemplate | Credential | Description | Task>
  ) => Promise<void>;
  updateData: (
    type:
      | "emails"
      | "credentials"
      | "descriptions"
      | "tasks"
      | "coldEmails"
      | "twitterBangers",
    id: string,
    data: Partial<EmailTemplate | Credential | Description | Task>
  ) => Promise<void>;
  deleteData: (
    type:
      | "emails"
      | "credentials"
      | "descriptions"
      | "tasks"
      | "coldEmails"
      | "twitterBangers",
    id: string
  ) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [emails, setEmails] = useState<EmailTemplate[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [coldEmails, setColdEmails] = useState<ColdEmailData[]>([]);
  const [twitterBangers, setTwitterBangers] = useState<TwitterBanger[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({
    emails: false,
    credentials: false,
    descriptions: false,
    tasks: false,
    coldEmails: false,
    twitterBangers: false,
  });
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({
    emails: "",
    credentials: "",
    descriptions: "",
    tasks: "",
    coldEmails: "",
    twitterBangers: "",
  });

  const setSearchTerm = useCallback((type: string, term: string) => {
    setSearchTerms((prev) => ({ ...prev, [type]: term }));
  }, []);

  const refreshData = useCallback(
    async (
      type:
        | "emails"
        | "credentials"
        | "descriptions"
        | "tasks"
        | "coldEmails"
        | "twitterBangers"
    ) => {
      try {
        setLoading((prev) => ({ ...prev, [type]: true }));
        const data = await fetchData(`/api/${type}`);
        switch (type) {
          case "emails":
            setEmails(data);
            break;
          case "credentials":
            setCredentials(data);
            break;
          case "descriptions":
            setDescriptions(data);
            break;
          case "tasks":
            setTasks(data);
            break;
          case "coldEmails":
            setColdEmails(data);
            break;
          case "twitterBangers":
            setTwitterBangers(data);
            break;
        }
      } catch (error) {
        console.error(`Failed to refresh ${type}:`, error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }));
      }
    },
    []
  );

  const addData = useCallback(
    async (
      type:
        | "emails"
        | "credentials"
        | "descriptions"
        | "tasks"
        | "coldEmails"
        | "twitterBangers",
      data: Partial<EmailTemplate | Credential | Description | Task>
    ) => {
      try {
        setLoading((prev) => ({ ...prev, [type]: true }));
        const response = await postData(`/api/${type}`, data);

        switch (type) {
          case "emails":
            setEmails((prev) => [...prev, response as EmailTemplate]);
            break;
          case "credentials":
            setCredentials((prev) => [...prev, response as Credential]);
            break;
          case "descriptions":
            setDescriptions((prev) => [...prev, response as Description]);
            break;
          case "tasks":
            setTasks((prev) => [...prev, response as Task]);
            break;
          case "coldEmails":
            setColdEmails((prev) => [...prev, response as ColdEmailData]);
            break;
          case "twitterBangers":
            setTwitterBangers((prev) => [...prev, response as TwitterBanger]);
            break;
        }

        return response;
      } catch (error) {
        console.error(`Failed to add ${type}:`, error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }));
      }
    },
    []
  );

  const updateData = useCallback(
    async (
      type:
        | "emails"
        | "credentials"
        | "descriptions"
        | "tasks"
        | "coldEmails"
        | "twitterBangers",
      id: string,
      data: Partial<EmailTemplate | Credential | Description | Task>
    ) => {
      try {
        setLoading((prev) => ({ ...prev, [type]: true }));
        const response = await fetch(`/api/${type}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Failed to update");

        const updated = await response.json();
        switch (type) {
          case "emails":
            setEmails((prev) =>
              prev.map((item) => (item.id === id ? updated : item))
            );
            break;
          case "credentials":
            setCredentials((prev) =>
              prev.map((item) => (item.id === id ? updated : item))
            );
            break;
          case "descriptions":
            setDescriptions((prev) =>
              prev.map((item) => (item.id === id ? updated : item))
            );
            break;
          case "tasks":
            setTasks((prev) =>
              prev.map((item) => (item.id === id ? updated : item))
            );
            break;
          case "coldEmails":
            setColdEmails((prev) =>
              prev.map((item) => (item.id === id ? updated : item))
            );
            break;
          case "twitterBangers":
            setTwitterBangers((prev) =>
              prev.map((item) => (item.id === id ? updated : item))
            );
            break;
        }
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }));
      }
    },
    []
  );

  const deleteData = useCallback(
    async (
      type:
        | "emails"
        | "credentials"
        | "descriptions"
        | "tasks"
        | "coldEmails"
        | "twitterBangers",
      id: string
    ) => {
      try {
        setLoading((prev) => ({ ...prev, [type]: true }));
        const response = await fetch(`/api/${type}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete");

        switch (type) {
          case "emails":
            setEmails((prev) => prev.filter((item) => item.id !== id));
            break;
          case "credentials":
            setCredentials((prev) => prev.filter((item) => item.id !== id));
            break;
          case "descriptions":
            setDescriptions((prev) => prev.filter((item) => item.id !== id));
            break;
          case "tasks":
            setTasks((prev) => prev.filter((item) => item.id !== id));
            break;
          case "coldEmails":
            setColdEmails((prev) => prev.filter((item) => item.id !== id));
            break;
          case "twitterBangers":
            setTwitterBangers((prev) => prev.filter((item) => item.id !== id));
            break;
        }
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }));
      }
    },
    []
  );

  return (
    <DataContext.Provider
      value={{
        emails,
        credentials,
        descriptions,
        tasks,
        loading,
        searchTerms,
        setSearchTerm,
        refreshData,
        addData,
        updateData,
        deleteData,
        coldEmails,
        twitterBangers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
