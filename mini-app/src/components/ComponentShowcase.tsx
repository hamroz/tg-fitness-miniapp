import React, { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Checkbox,
  Dialog,
  Input,
  Select,
  Skeleton,
  TextSkeleton,
  CircleSkeleton,
  RectSkeleton,
  Switch,
  Tabs,
  Tooltip,
  useToast,
} from "./ui";

const ComponentShowcase: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [switchState, setSwitchState] = useState(false);
  const [checkboxState, setCheckboxState] = useState(false);
  const { addToast } = useToast();

  // Select options
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  // Tab items
  const tabItems = [
    {
      id: "tab1",
      label: "Buttons",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="text">Text</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button>Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button isLoading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button icon={<span>🚀</span>}>With Icon</Button>
            <Button icon={<span>🚀</span>} iconPosition="right">
              Icon Right
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "tab2",
      label: "Inputs",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Inputs</h3>
          <Input label="Default Input" placeholder="Type something..." />
          <Input
            label="With Icon"
            placeholder="Search..."
            icon={<span>🔍</span>}
          />
          <Input
            label="With Error"
            placeholder="Error state"
            error="This field has an error"
          />
          <Input
            label="With Hint"
            placeholder="With hint text"
            hint="This is a hint text"
          />
          <Select label="Select Input" options={options} />
          <div className="flex items-center gap-4">
            <Checkbox
              id="checkbox-demo"
              label="Checkbox"
              checked={checkboxState}
              onChange={() => setCheckboxState(!checkboxState)}
            />
            <Switch
              id="switch-demo"
              label="Switch"
              checked={switchState}
              onChange={() => setSwitchState(!switchState)}
            />
          </div>
        </div>
      ),
    },
    {
      id: "tab3",
      label: "Cards",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Cards</h3>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Card Title</h3>
            </CardHeader>
            <CardContent>
              <p>
                This is the content of the card. It can contain any React
                elements.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="text" size="sm">
                Cancel
              </Button>
              <Button size="sm">Submit</Button>
            </CardFooter>
          </Card>
        </div>
      ),
    },
    {
      id: "tab4",
      label: "Others",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Avatars</h3>
            <div className="flex gap-4 flex-wrap">
              <Avatar size="xs" name="John Doe" />
              <Avatar size="sm" name="Jane Smith" />
              <Avatar size="md" name="Robert Johnson" />
              <Avatar size="lg" name="Emily Wilson" />
              <Avatar size="xl" name="Michael Brown" />
              <Avatar size="md" name="Sarah Davis" status="online" />
              <Avatar size="md" name="Thomas Miller" status="away" />
              <Avatar
                size="md"
                src="https://randomuser.me/api/portraits/men/32.jpg"
                status="online"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Badges</h3>
            <div className="flex gap-4 flex-wrap">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge rounded>Rounded</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Tooltips</h3>
            <div className="flex gap-4 flex-wrap">
              <Tooltip content="Top tooltip" position="top">
                <Button variant="outline" size="sm">
                  Top
                </Button>
              </Tooltip>
              <Tooltip content="Right tooltip" position="right">
                <Button variant="outline" size="sm">
                  Right
                </Button>
              </Tooltip>
              <Tooltip content="Bottom tooltip" position="bottom">
                <Button variant="outline" size="sm">
                  Bottom
                </Button>
              </Tooltip>
              <Tooltip content="Left tooltip" position="left">
                <Button variant="outline" size="sm">
                  Left
                </Button>
              </Tooltip>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Skeletons</h3>
            <div className="space-y-2">
              <TextSkeleton />
              <div className="flex gap-4">
                <CircleSkeleton width={40} height={40} />
                <div className="flex-1">
                  <TextSkeleton className="mb-1" />
                  <TextSkeleton width="60%" />
                </div>
              </div>
              <RectSkeleton height={100} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Dialog & Toast</h3>
            <div className="flex gap-4">
              <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
              <Button
                onClick={() => addToast("This is a success toast", "success")}
                variant="outline"
              >
                Show Toast
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Component Showcase</h1>

      <Tabs items={tabItems} />

      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Dialog Example"
        footer={
          <>
            <Button variant="text" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p>
          This is an example dialog component with a footer and close button.
        </p>
        <p className="mt-2">You can add any content here.</p>
      </Dialog>
    </div>
  );
};

export default ComponentShowcase;
