import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { UnitType } from "@prisma/client";
import { VesselsType } from "~/pages/api/vessel/getAll";

interface CreateVoyageFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const CreateVoyageForm: React.FC<CreateVoyageFormProps> = ({ onSuccess, onClose }) => {
  const [departure, setDeparture] = useState<string>("");
  const [arrival, setArrival] = useState<string>("");
  const [portOfLoading, setPortOfLoading] = useState<string>("");
  const [portOfDischarge, setPortOfDischarge] = useState<string>("");
  const [vesselId, setVesselId] = useState<string>("");
  const [vessels, setVessels] = useState<VesselsType>([]);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [selectedUnitTypes, setSelectedUnitTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchUnitTypes = async () => {
      try {
        const response = await axios.get<UnitType[]>("/api/unitType/getAll");
        setUnitTypes(response.data);
      } catch (error) {
        console.error("Error fetching unit types:", error);
      }
    };

    const fetchVessels = async () => {
      try {
        const response = await axios.get<VesselsType>("/api/vessel/getAll");
        setVessels(response.data);
      } catch (error) {
        console.error("Error fetching vessels:", error);
      }
    };

    fetchUnitTypes();
    fetchVessels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!departure || !arrival || !portOfLoading || !portOfDischarge || !vesselId || selectedUnitTypes.length < 5) {
      alert("All fields are required, and you must select at least 5 UnitTypes.");
      return;
    }

    if (new Date(departure) >= new Date(arrival)) {
      alert("Departure date and time should be before arrival date and time");
      return;
    }

    try {
      await axios.post("/api/voyage/create", {
        departure: new Date(departure).toISOString(),
      arrival: new Date(arrival).toISOString(),
        portOfLoading,
        portOfDischarge,
        vessel: vesselId,
        unitTypes: selectedUnitTypes,
      });

      onSuccess();
    } catch (error) {
      console.error("Error creating voyage:", error);
      alert("Failed to create the voyage");
    }
  };

  const handleUnitTypeToggle = (id: string) => {
    if (selectedUnitTypes.includes(id)) {
      setSelectedUnitTypes(selectedUnitTypes.filter((unitTypeId) => unitTypeId !== id));
    } else {
      setSelectedUnitTypes([...selectedUnitTypes, id]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Departure</label>
        <Input
          type="datetime-local"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Arrival</label>
        <Input
          type="datetime-local"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Port of Loading</label>
        <Input
          type="text"
          value={portOfLoading}
          onChange={(e) => setPortOfLoading(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Port of Discharge</label>
        <Input
          type="text"
          value={portOfDischarge}
          onChange={(e) => setPortOfDischarge(e.target.value)}
        />
      </div>
      <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Vessel</label>
  <select
    value={vesselId}
    onChange={(e) => setVesselId(e.target.value)}
    className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
  >
    <option value="">Select a vessel</option>
    {/* Map over your vessels data and create options */}
    {vessels.map((vessel) => (
      <option key={vessel.value} value={vessel.value}>
        {vessel.label}
      </option>
    ))}
  </select>
</div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Unit Types (Select at least 5)</label>
        {unitTypes.map((unitType) => (
          <div key={unitType.id} className="flex items-center">
            <input
              type="checkbox"
              id={unitType.id}
              checked={selectedUnitTypes.includes(unitType.id)}
              onChange={() => handleUnitTypeToggle(unitType.id)}
              className="mr-2"
            />
            <label htmlFor={unitType.id} className="text-sm font-medium text-gray-700">
              {unitType.name}
            </label>
          </div>
        ))}
     </div>
      <div className="flex justify-between">
        <Button type="submit">Create</Button>
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>
    </form>
  );
};

export default CreateVoyageForm;
