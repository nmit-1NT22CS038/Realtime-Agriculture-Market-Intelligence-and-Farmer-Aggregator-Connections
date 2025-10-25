import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface LocationPickerProps {
  address: string;
  onLocationSelect: (address: string) => void;
}

const LocationPicker = ({ address }: LocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Note: This is a placeholder. To enable Google Maps:
    // 1. Get a Google Maps API key from https://console.cloud.google.com/
    // 2. Add the script tag to index.html: <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
    // 3. Uncomment the code below

    /*
    if (mapRef.current && window.google) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India
        zoom: 5,
      });

      if (address) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);
            new google.maps.Marker({
              map,
              position: results[0].geometry.location,
            });
          }
        });
      }
    }
    */
  }, [address]);

  return (
    <Card className="p-4">
      <div 
        ref={mapRef} 
        className="w-full h-64 bg-muted rounded-lg flex items-center justify-center"
      >
        <div className="text-center text-muted-foreground">
          <p className="font-semibold mb-2">Google Maps Integration</p>
          <p className="text-sm">To enable maps:</p>
          <ol className="text-sm text-left mt-2 space-y-1">
            <li>1. Get API key from Google Cloud Console</li>
            <li>2. Add script tag to index.html</li>
            <li>3. Uncomment code in LocationPicker.tsx</li>
          </ol>
          {address && (
            <p className="mt-4 text-sm font-medium">
              Selected: {address}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LocationPicker;