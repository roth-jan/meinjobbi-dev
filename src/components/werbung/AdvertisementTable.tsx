import React from 'react';
import styles from '@/app/(main)/werbung/page.module.css';
import { WerbungDto, AdvertisementType, WerbungType } from './types';
import { EditIcon, TrashIcon } from './icons';

interface AdvertisementTableProps {
	items: WerbungDto[];
	currentPage: number;
	totalPages: number;
	onToggleStatus: (item: WerbungDto) => void;
	onEdit: (item: WerbungDto) => void;
	onDelete: (item: WerbungDto) => void;
	onWerbungClick: (item: WerbungDto) => void;
	onNew: () => void;
	onPageChange: (page: number) => void;
}

export const AdvertisementTable: React.FC<AdvertisementTableProps> = ({
	items,
	currentPage,
	totalPages,
	onToggleStatus,
	onEdit,
	onDelete,
	onWerbungClick,
	onNew,
	onPageChange,
}) => {
	return (
		<>
			<table className={styles.dataTable}>
				<thead>
					<tr>
						<th className={styles.colId}>ID</th>
						<th className={styles.colTitle}>Anzeige</th>
						<th className={styles.colType}>Typ</th>
						<th className={styles.colPlacement}>Platzierung</th>
						<th className={styles.colDate}>Erstellungsdatum</th>
						<th className={styles.colStatus}>Status</th>
						<th className={styles.colActions} />
					</tr>
				</thead>
				<tbody>
					{items.map((werbung) => (
						<tr
							key={werbung.id}
							className={!werbung.isPaid ? styles.disabledRow : undefined}
						>
							<td className={styles.colId}>
								<span className={styles.werbungName}>{werbung.id}</span>
							</td>
							<td className={styles.colTitle}>
								<span
									className={styles.werbungName}
									onClick={() => onEdit(werbung)}
								>
									{werbung.jobTitle}
								</span>
							</td>
							<td className={styles.colType}>
								<span className={styles.werbungType}>
									{getAdvertisementTypeName(werbung.advertisementType)}
								</span>
							</td>
							<td className={styles.colPlacement}>
								<span className={styles.werbungType}>
									{getTypeName(werbung.type)}
								</span>
							</td>
							<td className={styles.colDate}>
								<span className={styles.werbungName}>
									{werbung.registrationDate
										.toISOString()
										.split("T")[0]}
								</span>
							</td>
							<td className={styles.colStatus}>
								<label className={styles.switchContainer}>
									<input
										type="checkbox"
										className={styles.switchInput}
										checked={werbung.isPaid ? werbung.active : false}
										onChange={() => onToggleStatus(werbung)}
										disabled={!werbung.isPaid}
									/>
									<span className={styles.switchSlider} />
								</label>
							</td>
							<td className={styles.colActions}>
								<button
									type="button"
									className={`${styles.actionButton} ${styles.buttonMargin}`}
									onClick={() => onEdit(werbung)}
									title="Bearbeiten"
								>
									<EditIcon />
								</button>
								<button
									type="button"
									className={`${styles.actionButton} ${styles.buttonMargin}`}
									onClick={() => onDelete(werbung)}
									title="Löschen"
								>
									<TrashIcon />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Pagination */}
			<div className={styles.pagination}>
				<button
					type="button"
					className={styles.paginationButton}
					onClick={() => onPageChange(Math.max(1, currentPage - 1))}
					disabled={currentPage === 1}
				>
					&lt;
				</button>
				<span className={styles.paginationInfo}>
					Seite {currentPage} von {totalPages} ({items.length} Einträge)
				</span>
				<button
					type="button"
					className={styles.paginationButton}
					onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
					disabled={currentPage === totalPages}
				>
					&gt;
				</button>
			</div>

			{/* New Ad Button */}
			<div className={styles.buttonRow}>
				<button
					type="button"
					className={`${styles.jobbiButton} ${styles.jobbiButtonOrange} ${styles.newButton}`}
					onClick={onNew}
				>
					Neue Werbung schalten
				</button>
			</div>
		</>
	);
};

const getTypeName = (type: WerbungType): string => {
	const names: string[] = [];
	if (type & WerbungType.Jobbi_StartSeite) names.push("Jobbi Startseite");
	if (type & WerbungType.WebMenu_StartSeite) names.push("Webmenü Startseite");
	if (type & WerbungType.WebMenu_Login) names.push("Webmenü Login");
	if (type & WerbungType.WebMenu_Dashboard) names.push("Webmenü Dashboard");
	return names.length > 0 ? names.join(", ") : "Keine";
};

const getAdvertisementTypeName = (type: AdvertisementType): string => {
	switch (type) {
		case AdvertisementType.Stellenticker:
			return "Stellenticker";
		case AdvertisementType.Bannerwerbung:
			return "Bannerwerbung";
		default:
			return "Unbekannt";
	}
};
