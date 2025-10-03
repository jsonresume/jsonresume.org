import { Input } from '@repo/ui/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';

export function FilterSidebar({
  nameFilter,
  onNameChange,
  locationFilter,
  onLocationChange,
  positionFilter,
  onPositionChange,
  uniqueLocations,
  uniquePositions,
}) {
  return (
    <div className="w-64 mr-8">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="name-filter" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name-filter"
                placeholder="Filter by name..."
                value={nameFilter}
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="location-filter" className="text-sm font-medium">
                Location
              </label>
              <Select onValueChange={onLocationChange} value={locationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asdsd">All Locations</SelectItem>
                  {uniqueLocations.map((location, index) => (
                    <SelectItem key={index} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="position-filter" className="text-sm font-medium">
                Position
              </label>
              <Select onValueChange={onPositionChange} value={positionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asdsd">All Positions</SelectItem>
                  {uniquePositions.map((position, index) => (
                    <SelectItem key={index} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
