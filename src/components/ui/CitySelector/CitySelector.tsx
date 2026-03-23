"use client";

import { useState } from "react";
import styles from "./CitySelector.module.css";

export interface City {
	id: number;
	name: string;
	selected: boolean;
}

interface CitySelectorProps {
	cities: City[];
	localizationRequired: boolean;
	onCitiesChange: (cities: City[]) => void;
}

const ArrowDownIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M6 9l6 6 6-6" />
	</svg>
);

const CloseIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
);

const CheckIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="20 6 9 17 4 12" />
	</svg>
);

export function CitySelector({
	cities,
	localizationRequired,
	onCitiesChange,
}: CitySelectorProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [tempCities, setTempCities] = useState<City[]>([]);

	const selectedCities = cities.filter((c) => c.selected);
	const selectedCitiesText =
		selectedCities.length > 0
			? selectedCities.map((c) => c.name).join(", ")
			: "Bitte auswählen";

	const handleOpenDialog = () => {
		if (localizationRequired) {
			setTempCities(cities.map((c) => ({ ...c })));
			setIsDialogOpen(true);
		}
	};

	const handleToggleCity = (cityId: number) => {
		setTempCities((prev) =>
			prev.map((city) =>
				city.id === cityId ? { ...city, selected: !city.selected } : city
			)
		);
	};

	const handleConfirm = () => {
		onCitiesChange(tempCities);
		setIsDialogOpen(false);
	};

	const handleCancel = () => {
		setIsDialogOpen(false);
	};

	const handleRemoveCity = (cityId: number) => {
		onCitiesChange(
			cities.map((city) =>
				city.id === cityId ? { ...city, selected: false } : city
			)
		);
	};

	return (
		<div className={styles.container}>
			{/* Text input with dropdown icon */}
			<div
				className={`${styles.selectorInput} ${!localizationRequired ? styles.disabled : ""}`}
				onClick={handleOpenDialog}
			>
				<span
					className={`${styles.selectorText} ${selectedCities.length === 0 ? styles.placeholder : ""}`}
				>
					{selectedCitiesText}
				</span>
				<span className={styles.arrowIcon}>
					<ArrowDownIcon />
				</span>
			</div>

			{/* Selected cities as chips */}
			{selectedCities.length > 0 && localizationRequired && (
				<div className={styles.chipsContainer}>
					{selectedCities.map((city) => (
						<div key={city.id} className={styles.cityChip}>
							<button
								type="button"
								className={styles.chipCloseButton}
								onClick={() => handleRemoveCity(city.id)}
							>
								<CloseIcon />
							</button>
							<span className={styles.chipText}>{city.name}</span>
						</div>
					))}
				</div>
			)}

			{/* Dialog */}
			{isDialogOpen && (
				<div className={styles.dialogOverlay} onClick={handleCancel}>
					<div
						className={styles.dialogContent}
						onClick={(e) => e.stopPropagation()}
					>
						<div className={styles.dialogTitle}>Städte auswählen</div>
						<div className={styles.dialogBody}>
							{tempCities.map((city) => (
								<label key={city.id} className={styles.checkboxContainer}>
									<input
										type="checkbox"
										className={styles.checkboxInput}
										checked={city.selected}
										onChange={() => handleToggleCity(city.id)}
									/>
									<span
										className={`${styles.checkboxMark} ${city.selected ? styles.checked : ""}`}
									>
										{city.selected && <CheckIcon />}
									</span>
									<span className={styles.checkboxLabel}>{city.name}</span>
								</label>
							))}
						</div>
						<div className={styles.dialogButtons}>
							<button
								type="button"
								className={styles.cancelButton}
								onClick={handleCancel}
							>
								Abbrechen
							</button>
							<button
								type="button"
								className={styles.confirmButton}
								onClick={handleConfirm}
							>
								Bestätigen
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
