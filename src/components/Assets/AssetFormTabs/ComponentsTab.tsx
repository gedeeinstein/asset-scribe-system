
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2 } from 'lucide-react';
import { components } from '@/lib/data';

interface ComponentsTabProps {
  selectedComponents: string[];
  setSelectedComponents: (components: string[]) => void;
}

const ComponentsTab: React.FC<ComponentsTabProps> = ({ selectedComponents, setSelectedComponents }) => {
  const componentsByType = components.reduce((acc: Record<string, typeof components[0][]>, comp) => {
    if (!acc[comp.type]) {
      acc[comp.type] = [];
    }
    acc[comp.type].push(comp);
    return acc;
  }, {});

  const handleComponentToggle = (componentId: string, checked: boolean) => {
    if (checked) {
      setSelectedComponents([...selectedComponents, componentId]);
    } else {
      setSelectedComponents(selectedComponents.filter(id => id !== componentId));
    }
  };

  const getSelectedComponentNames = () => {
    return selectedComponents.map(id => {
      const component = components.find(c => c.id === id);
      return component ? component.name : 'Unknown';
    });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Hardware Components</CardTitle>
        <CardDescription>
          Select the components that make up this asset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {selectedComponents.length > 0 ? (
              <div className="bg-muted p-3 rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Selected Components ({selectedComponents.length})</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedComponents([])}
                  >
                    <X className="h-4 w-4 mr-1" /> Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getSelectedComponentNames().map((name, index) => (
                    <div key={index} className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-full flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-muted p-3 rounded-md text-center text-muted-foreground">
                No components selected
              </div>
            )}
          </div>
          
          <Accordion type="multiple" className="w-full">
            {Object.entries(componentsByType).map(([type, comps]) => (
              <AccordionItem key={type} value={type}>
                <AccordionTrigger>
                  {type} Components ({comps.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {comps.map(comp => (
                      <div key={comp.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                        <Checkbox
                          id={comp.id}
                          checked={selectedComponents.includes(comp.id)}
                          onCheckedChange={(checked) => handleComponentToggle(comp.id, checked as boolean)}
                        />
                        <Label 
                          htmlFor={comp.id} 
                          className="flex-grow cursor-pointer"
                        >
                          <div className="font-medium">{comp.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {comp.manufacturer} {comp.model}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentsTab;
