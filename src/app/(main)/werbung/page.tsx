"use client";

import { useState } from "react";
import { Card, Title, Stack, Group, Button } from "@mantine/core";
import { BasicFooter } from "@/components";
import { Popup } from "@/components/ui/Popup";
import styles from "./page.module.css";
import { AdvertisementTable } from "@/components/werbung/AdvertisementTable";
import { AdvertisementWizard } from "@/components/werbung/AdvertisementWizard";
import {
  WerbungDto,
  AdvertisementType,
  WerbungType,
} from "@/components/werbung/types";

// sample data used for demonstration
const TEMPLATE_WERBUNG_LIST: WerbungDto[] = [
  {
    id: 1,
    type: WerbungType.Jobbi_StartSeite,
    advertisementType: AdvertisementType.Stellenticker,
    duration: "1 Monat",
    active: true,
    isPaid: true,
    registrationDate: new Date("2025-01-15"),
    jobTitle: "Fachinformatiker Anwendungsentwicklung (m/w/d)",
  },
  {
    id: 2,
    type: WerbungType.WebMenu_Login,
    advertisementType: AdvertisementType.Bannerwerbung,
    duration: "2 Wochen",
    active: false,
    isPaid: true,
    registrationDate: new Date("2025-02-20"),
    jobTitle: "Banner: Ausbildungsstart 2025",
  },
  {
    id: 3,
    type: WerbungType.WebMenu_StartSeite | WerbungType.WebMenu_Login,
    advertisementType: AdvertisementType.Stellenticker,
    duration: "3 Monate",
    active: true,
    isPaid: false,
    registrationDate: new Date("2025-03-01"),
    jobTitle: "Kaufmann für Büromanagement (m/w/d)",
  },
];

export default function WerbungPage() {
  const [isWizard, setIsWizard] = useState(false);
  const [werbungList, setWerbungList] =
    useState<WerbungDto[]>(TEMPLATE_WERBUNG_LIST);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [werbungToDelete, setWerbungToDelete] = useState<WerbungDto | null>(
    null,
  );

  const pageSize = 5;
  const totalPages = Math.ceil(werbungList.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedWerbung = werbungList.slice(startIndex, startIndex + pageSize);

  const handleToggleStatus = (werbung: WerbungDto) => {
    if (!werbung.isPaid) {
      alert(
        "Die Werbung muss bezahlt werden, bevor sie aktiviert werden kann.",
      );
      return;
    }
    setWerbungList((prev) =>
      prev.map((w) =>
        w.id === werbung.id ? { ...w, active: !w.active } : w,
      ),
    );
  };

  const handleEditWerbung = (werbung: WerbungDto) => {
    console.log("Edit werbung:", werbung.id);
    setIsWizard(true);
  };

  const handleDeleteWerbung = (werbung: WerbungDto) => {
    setWerbungToDelete(werbung);
    setShowDeletePopup(true);
  };

  const confirmDeleteWerbung = () => {
    if (werbungToDelete) {
      setWerbungList((prev) =>
        prev.filter((w) => w.id !== werbungToDelete.id),
      );
    }
    setShowDeletePopup(false);
    setWerbungToDelete(null);
  };

  const handleNewWerbung = () => {
    setIsWizard(true);
  };

  const handleWizardExit = () => {
    setIsWizard(false);
  };

  const handleWizardPublish = () => {
    console.log("Publishing werbung...");
    alert("Weiterleitung zur Zahlung...");
    setIsWizard(false);
  };

  return (
    <>
      <Card shadow="sm" radius="lg">
        <Stack gap="md">
          <Title order={1} size="h2">
            {isWizard ? "Werbung schalten" : "Werbung verwalten"}
          </Title>

          {isWizard ? (
            <AdvertisementWizard
              onExit={handleWizardExit}
              onPublish={handleWizardPublish}
            />
          ) : (
            <AdvertisementTable
              items={paginatedWerbung}
              currentPage={currentPage}
              totalPages={totalPages}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEditWerbung}
              onDelete={handleDeleteWerbung}
              onWerbungClick={handleEditWerbung}
              onNew={handleNewWerbung}
              onPageChange={setCurrentPage}
            />
          )}
        </Stack>
      </Card>

      <Popup
        isOpen={showDeletePopup && !!werbungToDelete}
        onClose={() => {
          setShowDeletePopup(false);
          setWerbungToDelete(null);
        }}
        title="Werbung löschen"
        description={`Möchten Sie die Werbung "${werbungToDelete?.jobTitle}" wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.`}
      >
        <Group justify="center" gap="md" mt="lg">
          <Button
            variant="outline"
            color="gray"
            onClick={() => {
              setShowDeletePopup(false);
              setWerbungToDelete(null);
            }}
          >
            Abbrechen
          </Button>
          <Button color="red" onClick={confirmDeleteWerbung}>
            Löschen
          </Button>
        </Group>
      </Popup>

      <div className={styles.footerWrapper}>
        <BasicFooter />
      </div>
    </>
  );
}
