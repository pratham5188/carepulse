import { useState } from "react";
import { Calculator, Heart, Droplets, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getBMICategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500", bg: "bg-blue-500" };
  if (bmi < 25) return { label: "Normal", color: "text-green-500", bg: "bg-green-500" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-500", bg: "bg-yellow-500" };
  return { label: "Obese", color: "text-red-500", bg: "bg-red-500" };
}

function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<{ bmi: number; category: ReturnType<typeof getBMICategory> } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!height || !weight || isNaN(h) || isNaN(w)) {
      setError("Please enter both height and weight");
      return;
    }
    if (h <= 0 || h > 300) {
      setError("Please enter a valid height (1-300 cm)");
      return;
    }
    if (w <= 0 || w > 500) {
      setError("Please enter a valid weight (1-500 kg)");
      return;
    }
    const heightM = h / 100;
    const bmi = w / (heightM * heightM);
    setResult({ bmi, category: getBMICategory(bmi) });
  };

  const gaugePercent = result ? Math.min(Math.max((result.bmi / 40) * 100, 0), 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          BMI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bmi-height">Height (cm)</Label>
            <Input id="bmi-height" type="number" placeholder="170" value={height} onChange={(e) => { setHeight(e.target.value); setError(""); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bmi-weight">Weight (kg)</Label>
            <Input id="bmi-weight" type="number" placeholder="70" value={weight} onChange={(e) => { setWeight(e.target.value); setError(""); }} />
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button type="button" onClick={calculate} className="w-full">Calculate BMI</Button>
        {result && (
          <div className="mt-4 space-y-3">
            <div className="text-center">
              <p className="text-4xl font-bold">{result.bmi.toFixed(1)}</p>
              <p className={`text-lg font-semibold ${result.category.color}`}>{result.category.label}</p>
            </div>
            <div className="w-full h-4 bg-muted rounded-full overflow-hidden relative">
              <div className="absolute inset-0 flex">
                <div className="h-full bg-blue-400 flex-1" />
                <div className="h-full bg-green-400 flex-1" />
                <div className="h-full bg-yellow-400 flex-1" />
                <div className="h-full bg-red-400 flex-1" />
              </div>
              <div
                className="absolute top-0 h-full w-1 bg-foreground rounded-full transition-all duration-500"
                style={{ left: `${gaugePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function HeartRateZoneCalculator() {
  const [age, setAge] = useState("");
  const [result, setResult] = useState<{ maxHR: number; zones: { name: string; min: number; max: number; color: string }[] } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const a = parseInt(age);
    if (!age || isNaN(a)) {
      setError("Please enter your age");
      return;
    }
    if (a <= 0 || a >= 150) {
      setError("Please enter a valid age (1-149)");
      return;
    }
    const maxHR = 220 - a;
    const zones = [
      { name: "Rest", min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6), color: "bg-gray-400" },
      { name: "Fat Burn", min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7), color: "bg-blue-400" },
      { name: "Cardio", min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8), color: "bg-green-500" },
      { name: "Peak", min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9), color: "bg-orange-500" },
      { name: "Max", min: Math.round(maxHR * 0.9), max: maxHR, color: "bg-red-500" },
    ];
    setResult({ maxHR, zones });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Heart Rate Zone Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hr-age">Age (years)</Label>
          <Input id="hr-age" type="number" placeholder="30" value={age} onChange={(e) => { setAge(e.target.value); setError(""); }} />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button type="button" onClick={calculate} className="w-full">Calculate Zones</Button>
        {result && (
          <div className="mt-4 space-y-3">
            <p className="text-center text-sm text-muted-foreground">Max Heart Rate: <span className="font-bold text-foreground text-lg">{result.maxHR} bpm</span></p>
            <div className="space-y-2">
              {result.zones.map((zone) => (
                <div key={zone.name} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${zone.color} shrink-0`} />
                  <span className="text-sm font-medium w-20">{zone.name}</span>
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden relative">
                    <div
                      className={`h-full ${zone.color} rounded-full transition-all duration-500`}
                      style={{ width: `${(zone.max / result.maxHR) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-24 text-right">{zone.min}–{zone.max} bpm</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getBPCategory(systolic: number, diastolic: number) {
  if (systolic >= 180 || diastolic >= 120) return { label: "Hypertensive Crisis", color: "text-purple-600", bg: "bg-purple-600" };
  if (systolic >= 140 || diastolic >= 90) return { label: "High - Stage 2", color: "text-red-500", bg: "bg-red-500" };
  if (systolic >= 130 || diastolic >= 80) return { label: "High - Stage 1", color: "text-orange-500", bg: "bg-orange-500" };
  if (systolic >= 120 && diastolic < 80) return { label: "Elevated", color: "text-yellow-500", bg: "bg-yellow-500" };
  return { label: "Normal", color: "text-green-500", bg: "bg-green-500" };
}

function BloodPressureClassifier() {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [result, setResult] = useState<ReturnType<typeof getBPCategory> | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const s = parseInt(systolic);
    const d = parseInt(diastolic);
    if (!systolic || !diastolic || isNaN(s) || isNaN(d)) {
      setError("Please enter both systolic and diastolic values");
      return;
    }
    if (s <= 0 || s > 300) {
      setError("Please enter a valid systolic value (1-300)");
      return;
    }
    if (d <= 0 || d > 200) {
      setError("Please enter a valid diastolic value (1-200)");
      return;
    }
    setResult(getBPCategory(s, d));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-500" />
          Blood Pressure Classifier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bp-systolic">Systolic (mmHg)</Label>
            <Input id="bp-systolic" type="number" placeholder="120" value={systolic} onChange={(e) => { setSystolic(e.target.value); setError(""); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bp-diastolic">Diastolic (mmHg)</Label>
            <Input id="bp-diastolic" type="number" placeholder="80" value={diastolic} onChange={(e) => { setDiastolic(e.target.value); setError(""); }} />
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button type="button" onClick={calculate} className="w-full">Classify</Button>
        {result && (
          <div className="mt-4 text-center space-y-3">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${result.bg}/10`}>
              <div className={`w-3 h-3 rounded-full ${result.bg}`} />
              <span className={`text-lg font-bold ${result.color}`}>{result.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {systolic}/{diastolic} mmHg
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState<{ liters: number; glasses: number } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const w = parseFloat(weight);
    if (!weight || isNaN(w)) {
      setError("Please enter your weight");
      return;
    }
    if (w <= 0 || w > 500) {
      setError("Please enter a valid weight (1-500 kg)");
      return;
    }
    const multiplier = activity === "low" ? 0.033 : activity === "moderate" ? 0.04 : 0.05;
    const liters = w * multiplier;
    setResult({ liters, glasses: Math.ceil(liters / 0.25) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          Water Intake Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="water-weight">Weight (kg)</Label>
          <Input id="water-weight" type="number" placeholder="70" value={weight} onChange={(e) => { setWeight(e.target.value); setError(""); }} />
        </div>
        <div className="space-y-2">
          <Label>Activity Level</Label>
          <div className="flex gap-2">
            {(["low", "moderate", "high"] as const).map((level) => (
              <Button
                key={level}
                type="button"
                variant={activity === level ? "default" : "outline"}
                size="sm"
                className="flex-1 capitalize"
                onClick={() => setActivity(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button type="button" onClick={calculate} className="w-full">Calculate</Button>
        {result && (
          <div className="mt-4 space-y-3">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-500">{result.liters.toFixed(1)}L</p>
              <p className="text-sm text-muted-foreground">Daily recommended water intake</p>
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {Array.from({ length: result.glasses }).map((_, i) => (
                <div key={i} className="w-6 h-8 rounded-sm bg-blue-400/80 flex items-center justify-center" title={`Glass ${i + 1}`}>
                  <Droplets className="h-3 w-3 text-white" />
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">≈ {result.glasses} glasses (250ml each)</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function HealthCalculators() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Tools</h1>
        <p className="text-muted-foreground mt-1">Interactive health calculators to help you monitor your wellness</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BMICalculator />
        <HeartRateZoneCalculator />
        <BloodPressureClassifier />
        <WaterIntakeCalculator />
      </div>
    </div>
  );
}
