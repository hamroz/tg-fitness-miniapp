import React, { useState, useEffect, useRef } from "react";

interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "default" | "pills" | "enclosed";
  className?: string;
  tabClassName?: string;
  panelClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  onChange,
  variant = "default",
  className = "",
  tabClassName = "",
  panelClassName = "",
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultActiveTab || (items.length > 0 ? items[0].id : "")
  );
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Update indicator position
  useEffect(() => {
    if (variant !== "default") return;

    const activeTabIndex = items.findIndex((item) => item.id === activeTab);
    if (activeTabIndex !== -1 && tabsRef.current[activeTabIndex]) {
      const tabElement = tabsRef.current[activeTabIndex];
      if (tabElement) {
        setIndicatorStyle({
          left: tabElement.offsetLeft,
          width: tabElement.offsetWidth,
        });
      }
    }
  }, [activeTab, items, variant]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case "pills":
        return "space-x-1";
      case "enclosed":
        return "border-b border-border";
      default:
        return "border-b border-border";
    }
  };

  // Tab styles
  const getTabStyles = (item: TabItem) => {
    const isActive = activeTab === item.id;

    switch (variant) {
      case "pills":
        return `px-4 py-2 rounded-lg transition-colors ${
          isActive
            ? "bg-accent text-white shadow-sm"
            : "text-text-secondary hover:text-text hover:bg-gray-100"
        }`;
      case "enclosed":
        return `px-4 py-2 border-t border-l border-r border-border rounded-t-lg -mb-px transition-colors ${
          isActive
            ? "bg-paper text-accent border-border"
            : "bg-gray-50 text-text-secondary hover:text-text border-transparent hover:bg-gray-100"
        }`;
      default:
        return `px-4 py-2 text-sm font-medium transition-colors ${
          isActive ? "text-accent" : "text-text-secondary hover:text-text"
        }`;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tab List */}
      <div className={`flex ${getVariantStyles()}`} role="tablist">
        {items.map((item, index) => (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            ref={(el) => (tabsRef.current[index] = el)}
            role="tab"
            aria-selected={activeTab === item.id}
            aria-controls={`panel-${item.id}`}
            tabIndex={activeTab === item.id ? 0 : -1}
            className={`
              flex items-center justify-center
              font-medium disabled:opacity-50 disabled:cursor-not-allowed
              ${getTabStyles(item)}
              ${tabClassName}
            `}
            onClick={() => !item.disabled && handleTabChange(item.id)}
            disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}

        {/* Active tab indicator (only for default variant) */}
        {variant === "default" && (
          <div
            className="absolute bottom-0 h-0.5 bg-accent transition-all duration-300 ease-in-out"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        )}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {items.map((item) => (
          <div
            key={item.id}
            id={`panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${item.id}`}
            className={`
              ${activeTab === item.id ? "block animate-fadeIn" : "hidden"}
              ${panelClassName}
            `}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
