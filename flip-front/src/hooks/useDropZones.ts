import { useRef, useCallback } from 'react';
import { DropZone } from './useDragAndDrop';

export function useDropZones() {
    const dropZonesRef = useRef<DropZone[]>([]);
    const measureCallbacks = useRef<{ [key: number]: (layout: { x: number; y: number; width: number; height: number }) => void }>({});

    // Enregistrer une zone de drop
    const registerDropZone = useCallback((id: number) => {
        const measureCallback = (layout: { x: number; y: number; width: number; height: number }) => {
            const existingZoneIndex = dropZonesRef.current.findIndex(zone => zone.id === id);

            const newZone: DropZone = {
                id,
                x: layout.x,
                y: layout.y,
                width: layout.width,
                height: layout.height,
            };

            if (existingZoneIndex >= 0) {
                // Mettre à jour la zone existante
                dropZonesRef.current[existingZoneIndex] = newZone;
            } else {
                // Ajouter une nouvelle zone
                dropZonesRef.current.push(newZone);
            }
        };

        measureCallbacks.current[id] = measureCallback;
        return measureCallback;
    }, []);

    // Désinscrire une zone de drop
    const unregisterDropZone = useCallback((id: number) => {
        dropZonesRef.current = dropZonesRef.current.filter(zone => zone.id !== id);
        delete measureCallbacks.current[id];
    }, []);

    // Obtenir toutes les zones de drop
    const getDropZones = useCallback((): DropZone[] => {
        return [...dropZonesRef.current];
    }, []);

    // Effacer toutes les zones
    const clearDropZones = useCallback(() => {
        dropZonesRef.current = [];
        measureCallbacks.current = {};
    }, []);

    // Obtenir une zone spécifique
    const getDropZone = useCallback((id: number): DropZone | undefined => {
        return dropZonesRef.current.find(zone => zone.id === id);
    }, []);

    return {
        registerDropZone,
        unregisterDropZone,
        getDropZones,
        clearDropZones,
        getDropZone,
    };
} 