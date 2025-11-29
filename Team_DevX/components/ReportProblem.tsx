import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Upload, X, Loader2, CheckCircle2, Sparkles, Compass, Navigation } from "lucide-react";
import LocationPicker from "@/components/location/LocationPicker";
import { motion, AnimatePresence } from "framer-motion";

interface ReportProblemProps {
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  { value: "roads", label: "Roads & Infrastructure" },
  { value: "water", label: "Water Supply" },
  { value: "electricity", label: "Electricity" },
  { value: "sanitation", label: "Sanitation & Waste" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "pollution", label: "Pollution" },
  { value: "safety", label: "Public Safety" },
  { value: "other", label: "Other" },
];

type FormData = {
  title: string;
  description: string;
  category: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
};

const ReportProblem = ({ onClose, onSuccess }: ReportProblemProps) => {
  const BUCKET_NAME = import.meta.env.VITE_PROBLEM_BUCKET ?? "problem-attachments";
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: categories[0].value,
    pincode: "",
    latitude: null,
    longitude: null,
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [resolvedAreaHint, setResolvedAreaHint] = useState<string | null>(null);
  const [autoAreaDetails, setAutoAreaDetails] = useState<string>("");
  const [manualAreaDetails, setManualAreaDetails] = useState<string>("");
  const [manualState, setManualState] = useState<string | undefined>();
  const [manualDistrict, setManualDistrict] = useState<string | undefined>();
  const [manualSuggestionLabel, setManualSuggestionLabel] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [addressLookupState, setAddressLookupState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [locationStrategy, setLocationStrategy] = useState<"current" | "manual">("current");
  const [pendingLocation, setPendingLocation] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentChange = (file: File | null) => {
    setAttachment(file);
    setFileError(null);
  };

  const detectAddressFromCoords = useCallback(
    async (lat: number, lng: number, syncPincode = false) => {
      try {
        setAddressLookupState("loading");
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const res = await fetch(url, {
          headers: { "Accept-Language": "en" },
        });
        if (!res.ok) throw new Error("Unable to fetch address");
        const data = await res.json();
        const address = data.address ?? {};
        const locality = address.suburb || address.village || address.neighbourhood || address.town || address.city || null;
        const state = address.state;
        const derivedArea = locality ? `${locality}${state ? `, ${state}` : ""}` : data.display_name?.split(", ").slice(0, 2).join(", ") || null;
        setResolvedAreaHint(derivedArea);
        if (derivedArea) {
          setAutoAreaDetails((prev) => (prev ? prev : derivedArea));
        }
        if (syncPincode && address.postcode) {
          const sanitized = address.postcode.replace(/[^0-9]/g, "").slice(-6);
          if (sanitized) {
            setFormData((prev) => ({ ...prev, pincode: sanitized }));
          }
        }
        setAddressLookupState("success");
      } catch (error) {
        console.error("Reverse geocode error", error);
        setAddressLookupState("error");
      }
    },
    [],
  );

  const applyLocation = useCallback(
    async (lat: number, lng: number, { autoDetect = true }: { autoDetect?: boolean } = {}) => {
      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
      if (autoDetect) {
        await detectAddressFromCoords(lat, lng, true);
      }
    },
    [detectAddressFromCoords],
  );

  const getLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await applyLocation(position.coords.latitude, position.coords.longitude);
          setLocationLoading(false);
          toast({
            title: "Location detected ✅",
            description: "Your current location has been added.",
          });
        },
        () => {
          setLocationLoading(false);
          toast({
            title: "Location unavailable",
            description:
              "Could not get your location. Please ensure location permissions are granted or enter coordinates manually.",
            variant: "destructive",
            duration: 7000,
          });
        }
      );
    } else {
      setLocationLoading(false);
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location access.",
        variant: "destructive",
        duration: 7000,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.latitude == null || formData.longitude == null)
        throw new Error("A precise location is required.");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please log in to report a problem.");

      // Check profile
      const { data: profile } = await supabase.from("profiles").select("id").eq("id", session.user.id).single();
      if (!profile) throw new Error("User profile missing. Try logging out and back in.");

      if (!attachment) {
        setFileError("Please attach a photo, video, or document.");
        throw new Error("Attachment missing");
      }

      // Upload
      const filePath = `${session.user.id}/${Date.now()}_${attachment.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, attachment);

      if (uploadError) throw uploadError;
      setUploadProgress(100);

      const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
      const mediaUrl = publicUrlData.publicUrl;

      const locationNotes: string[] = [];
      if (locationStrategy === "current") {
        if (resolvedAreaHint) locationNotes.push(`Detected area: ${resolvedAreaHint}`);
        if (autoAreaDetails.trim()) locationNotes.push(`Area details: ${autoAreaDetails.trim()}`);
      } else {
        if (manualState) locationNotes.push(`Manual state: ${manualState}`);
        if (manualDistrict) locationNotes.push(`District: ${manualDistrict}`);
        if (manualSuggestionLabel) locationNotes.push(`Suggested place: ${manualSuggestionLabel}`);
        if (manualAreaDetails.trim()) locationNotes.push(`Area details: ${manualAreaDetails.trim()}`);
      }
      const fullDescription = locationNotes.length
        ? `${formData.description}\n\nLocation notes:\n- ${locationNotes.join("\n- ")}`
        : formData.description;

      const { error } = await supabase.from("problems").insert({
        user_id: session.user.id,
        title: formData.title,
        description: fullDescription,
        category: formData.category as 'roads' | 'water' | 'electricity' | 'sanitation' | 'education' | 'healthcare' | 'pollution' | 'safety' | 'other',
        pincode: formData.pincode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        media_url: mediaUrl,
      });

      if (error) throw error;

      toast({
        title: "Problem reported 🎉",
        description: "Your report has been submitted successfully.",
      });
      setAttachment(null);
      setFilePreview(null);
      setFormData({
        title: "",
        description: "",
        category: categories[0].value,
        pincode: "",
        latitude: null,
        longitude: null,
      });
      setResolvedAreaHint(null);
      setAutoAreaDetails("");
      setManualAreaDetails("");
      setManualState(undefined);
      setManualDistrict(undefined);
      setManualSuggestionLabel(null);
      setPendingLocation(null);
      setLocationStrategy("current");
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const tips = useMemo(
    () => [
      {
        title: "Priority routing",
        body: "Accurate pins & pincodes help ministries auto-route the request.",
      },
      {
        title: "Visual clarity",
        body: "Upload bright, in-focus media to fast-track field verification.",
      },
      {
        title: "Community impact",
        body: "Explain who is affected and since when to boost urgency.",
      },
    ],
    [],
  );

  const locateByPincode = async (pin: string) => {
    if (pin.length !== 6) return;
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const json = await res.json();
      const office = json?.[0]?.PostOffice?.[0];
      if (json?.[0]?.Status === "Success" && office) {
        const hint = `${office.Name}, ${office.District}`;
        setResolvedAreaHint(hint);
        setAutoAreaDetails((prev) => (prev ? prev : hint));
      }
    } catch (error) {
      console.error("Pincode lookup failed", error);
    }
  };

  const mapInitial =
    formData.latitude != null && formData.longitude != null
      ? { lat: formData.latitude, lng: formData.longitude }
      : pendingLocation ?? null;

  useEffect(() => {
    if (!attachment) {
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    const objectUrl = URL.createObjectURL(attachment);
    setFilePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [attachment]);

  useEffect(() => {
    if (!manualState || !manualDistrict) {
      setManualAreaDetails("");
    }
  }, [manualState, manualDistrict]);

  useEffect(() => {
    if (!manualState || !manualDistrict) {
      setManualSuggestionLabel(null);
    }
  }, [manualState, manualDistrict]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-background to-background/80 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-foreground flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" /> Report an issue
          </DialogTitle>
          <DialogDescription className="text-base">
            Your report notifies the right ministry cell instantly. Share specifics for faster turnarounds.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[80vh] overflow-y-auto pr-2 custom-scroll">
          <Card className="border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Problem details</CardTitle>
              <CardDescription>
                Keep it short and actionable. Ministries rely on the first 140 characters for triage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Problem title *</Label>
                <Input
                  id="title"
                  placeholder="E.g. Broken streetlight on main road"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Impact checklist</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Mention duration</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Describe current risk</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Share who is affected</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the problem clearly..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Location & coverage</CardTitle>
              <CardDescription>Pick where the issue exists. Accurate pins help route your report to the correct ward engineer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Compass className="h-4 w-4 text-primary" />Auto location
                    </p>
                    <p className="text-xs text-muted-foreground">Use device GPS and fine-tune the area name before submitting.</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-primary/30 bg-primary/5 text-primary"
                    onClick={() => {
                      setLocationStrategy("current");
                      getLocation();
                    }}
                    disabled={locationLoading}
                  >
                    {locationLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Navigation className="mr-2 h-4 w-4" />}
                    {locationLoading ? "Detecting..." : "Detect my location"}
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude *</Label>
                    <Input
                      id="latitude"
                      inputMode="decimal"
                      value={formData.latitude ?? ""}
                      placeholder="12.9716"
                      onChange={(e) => {
                        const raw = e.target.value;
                        const parsed = raw === "" ? null : Number(raw);
                        setFormData((prev) => ({ ...prev, latitude: parsed !== null && Number.isFinite(parsed) ? parsed : null }));
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude *</Label>
                    <Input
                      id="longitude"
                      inputMode="decimal"
                      value={formData.longitude ?? ""}
                      placeholder="77.5946"
                      onChange={(e) => {
                        const raw = e.target.value;
                        const parsed = raw === "" ? null : Number(raw);
                        setFormData((prev) => ({ ...prev, longitude: parsed !== null && Number.isFinite(parsed) ? parsed : null }));
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auto-area">Area details (auto)</Label>
                  <Textarea
                    id="auto-area"
                    placeholder="Add nearest landmark, street name, or ward"
                    rows={3}
                    value={autoAreaDetails}
                    onChange={(e) => setAutoAreaDetails(e.target.value)}
                  />
                  {resolvedAreaHint && (
                    <p className="text-xs text-muted-foreground">Detected area: {resolvedAreaHint}</p>
                  )}
                  {addressLookupState === "loading" && (
                    <p className="text-xs text-muted-foreground">Resolving address…</p>
                  )}
                  {addressLookupState === "error" && (
                    <p className="text-xs text-destructive">Couldn't fetch area details. You can still continue.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <MapPin className="h-4 w-4 text-primary" /> Manual map
                    </p>
                    <p className="text-xs text-muted-foreground">Pick a state, district, and area suggestion to lock the pin.</p>
                  </div>
                </div>

                <LocationPicker
                  initial={pendingLocation ?? mapInitial}
                  onLocationChange={(coords) => setPendingLocation(coords)}
                  onAdministrativeChange={({ state, district }) => {
                    setManualState(state);
                    setManualDistrict(district);
                  }}
                  onPlaceSelected={(info) => {
                    setManualSuggestionLabel(info.label);
                    if (info.pincode) {
                      const sanitized = info.pincode.replace(/[^0-9]/g, "").slice(-6);
                      if (sanitized) {
                        setFormData((prev) => ({ ...prev, pincode: sanitized }));
                      }
                    }
                  }}
                  onConfirm={async (payload) => {
                    setPendingLocation({ lat: payload.lat, lng: payload.lng });
                    await applyLocation(payload.lat, payload.lng, { autoDetect: false });
                    setLocationStrategy("manual");
                    setResolvedAreaHint(null);
                    if (payload.state) setManualState(payload.state);
                    if (payload.district) setManualDistrict(payload.district);
                    if (payload.areaLabel) setManualAreaDetails(payload.areaLabel);
                    toast({
                      title: "Manual location locked",
                      description: `Using ${payload.lat.toFixed(5)}, ${payload.lng.toFixed(5)}`,
                    });
                  }}
                  googlePlacesApiKey={import.meta.env.VITE_GOOGLE_API_KEY ?? import.meta.env.VITE_GOOGLE_PLACES_API_KEY ?? null}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-black/10 p-3">
                    <p className="text-xs text-muted-foreground">State / UT</p>
                    <p className="text-sm font-medium text-foreground">{manualState ?? "Awaiting selection"}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/10 p-3">
                    <p className="text-xs text-muted-foreground">District</p>
                    <p className="text-sm font-medium text-foreground">{manualDistrict ?? "Choose via dropdown"}</p>
                  </div>
                </div>

                {manualSuggestionLabel && (
                  <p className="text-sm text-muted-foreground">Selected area suggestion: {manualSuggestionLabel}</p>
                )}

                <div className="space-y-2">
                  <Label htmlFor="manual-area">Area details (manual)</Label>
                  <Textarea
                    id="manual-area"
                    placeholder="House number, colony, block, nearby facility"
                    rows={3}
                    value={manualAreaDetails}
                    onChange={(e) => setManualAreaDetails(e.target.value)}
                    disabled={!manualState || !manualDistrict}
                  />
                  {(!manualState || !manualDistrict) && (
                    <p className="text-xs text-muted-foreground">Select a state and district to enable manual area notes.</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pincode">Pincode *</Label>
                  {formData.latitude != null && formData.longitude != null && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() =>
                        formData.latitude != null && formData.longitude != null &&
                        detectAddressFromCoords(formData.latitude, formData.longitude, true)
                      }
                    >
                      Refresh from pin
                    </Button>
                  )}
                </div>
                <Input
                  id="pincode"
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                    setFormData((prev) => ({ ...prev, pincode: val }));
                    setResolvedAreaHint(null);
                  }}
                  onBlur={() => locateByPincode(formData.pincode)}
                  required
                />
                {resolvedAreaHint && <p className="text-sm text-muted-foreground">Area • {resolvedAreaHint}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Evidence & attachments</CardTitle>
              <CardDescription>Upload a sharp photo/video or a signed document. Max 25 MB.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="relative flex flex-col items-center justify-center w-full gap-2 rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02] p-8 text-center transition hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                onClick={() => {
                  // Reset input value first to allow same file to be selected
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                    fileInputRef.current.click();
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const file = event.dataTransfer.files?.[0];
                  if (file) handleAttachmentChange(file);
                }}
                onDragOver={(event) => event.preventDefault()}
              >
                <Upload className="h-8 w-8 text-primary" />
                <p className="text-sm text-muted-foreground">
                  {attachment ? attachment.name : "Click to upload or drag & drop"}
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, MP4, PDF up to 25 MB</p>
                <input
                  ref={fileInputRef}
                  id="attachment"
                  type="file"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  accept="image/*,video/*,.pdf"
                  onChange={(e) => {
                    handleAttachmentChange(e.target.files?.[0] || null);
                  }}
                />
              </div>

              {fileError && <p className="text-xs text-destructive">{fileError}</p>}

              <AnimatePresence>
                {attachment && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">{(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button type="button" size="sm" variant="ghost" onClick={() => handleAttachmentChange(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {filePreview && attachment.type.startsWith("image/") && (
                      <img src={filePreview} alt="Attachment preview" className="h-40 w-full rounded-xl object-cover" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {uploadProgress > 0 && uploadProgress < 100 && <Progress value={uploadProgress} className="h-2 rounded-full" />}
              {uploadProgress === 100 && (
                <p className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Upload complete
                </p>
              )}

              <div className="grid gap-3 md:grid-cols-3">
                {tips.map((tip) => (
                  <div key={tip.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                    <p className="text-xs uppercase tracking-wide text-primary">{tip.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{tip.body}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-white/20 bg-transparent px-6 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 px-8 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:opacity-90"
            >
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</> : "Submit report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportProblem;
