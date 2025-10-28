import React, { useEffect, useRef, useState } from 'react';

// Utility: classnames joiner
function cn(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

// Minimal date helpers to avoid external deps
function parseISO(value: string): Date { return new Date(value); }
function isBefore(a: Date, b: Date): boolean { return a.getTime() < b.getTime(); }
function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('es-ES', { month: 'short' });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

// Icons and UI primitives adapted from v0
const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const MoreVerticalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);

const ZapIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const RefreshCwIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const ColumnsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="12" y1="3" x2="12" y2="21"></line>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ChevronsLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="11 17 6 12 11 7"></polyline>
    <polyline points="18 17 13 12 18 7"></polyline>
  </svg>
);

const ChevronsRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="13 17 18 12 13 7"></polyline>
    <polyline points="6 17 11 12 6 7"></polyline>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }
>(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
        variant === 'outline' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        size === 'sm' && 'h-8 px-3 text-xs',
        size === 'icon' && 'h-8 w-8',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

const Badge = ({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: string }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variant === 'secondary' && 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        variant === 'outline' && 'text-foreground',
        className,
      )}
      {...props}
    />
  );
};

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<any>, { open, setOpen }) : child,
      )}
    </div>
  );
};

const DropdownMenuTrigger = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  return (
    <div onClick={() => setOpen?.(!open)} className="cursor-pointer">
      {children}
    </div>
  );
};

const DropdownMenuContent = ({
  children,
  open,
  setOpen,
  align = 'end',
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  align?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen?.(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        align === 'end' && 'right-0',
        align === 'start' && 'left-0',
      )}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const DropdownMenuCheckboxItem = ({
  children,
  checked,
  onCheckedChange,
}: {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) => {
  return (
    <div
      className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
      onClick={() => onCheckedChange?.(!checked)}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <span className="h-2 w-2 rounded-sm bg-current" />}
      </span>
      {children}
    </div>
  );
};

const DropdownMenuSeparator = () => {
  return <div className="-mx-1 my-1 h-px bg-muted" />;
};

const DropdownMenuLabel = ({ children }: { children: React.ReactNode }) => {
  return <div className="px-2 py-1.5 text-sm font-semibold">{children}</div>;
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block">{children}</div>;
};

const TooltipTrigger = ({ children }: { children: React.ReactNode }) => {
  return <div className="inline-block">{children}</div>;
};

const TooltipContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md">
      {children}
    </div>
  );
};

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

const Select = ({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { value, onValueChange, open, setOpen })
          : child,
      )}
    </div>
  );
};

const SelectTrigger = ({
  children,
  open,
  setOpen,
  className,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  className?: string;
}) => {
  return (
    <button
      onClick={() => setOpen?.(!open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      {children}
      <ChevronDownIcon />
    </button>
  );
};

const SelectValue = ({ placeholder, value }: { placeholder?: string; value?: string }) => {
  return <span>{value || placeholder}</span>;
};

const SelectContent = ({
  children,
  open,
  setOpen,
  onValueChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen?.(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { onValueChange, setOpen })
          : child,
      )}
    </div>
  );
};

const SelectItem = ({
  value,
  children,
  onValueChange,
  setOpen,
}: {
  value: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  setOpen?: (open: boolean) => void;
}) => {
  return (
    <div
      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
      onClick={() => {
        onValueChange?.(value);
        setOpen?.(false);
      }}
    >
      {children}
    </div>
  );
};

// Types for v0
export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'currency' | 'status';
  fixed?: boolean;
}

export interface DataRow { [key: string]: any }

export interface EnterpriseDataGridProps {
  columns: Column[];
  data: DataRow[];
  enableHyperlinks?: boolean;
  onView?: (row: DataRow) => void;
  onEdit?: (row: DataRow) => void;
  onDelete?: (row: DataRow) => void;
  onQuickAction?: (row: DataRow) => void;
  onRefresh?: () => void;
  onDownload?: () => void;
}

export const EnterpriseDataGrid: React.FC<EnterpriseDataGridProps> = ({
  columns: initialColumns,
  data,
  enableHyperlinks = false,
  onView,
  onEdit,
  onDelete,
  onQuickAction,
  onRefresh,
  onDownload,
}) => {
  const defaultColumns: Column[] = [
    { key: 'actions', label: '', sortable: false, filterable: false, fixed: true },
    { key: 'id', label: 'ID', sortable: true, filterable: true, type: 'text', fixed: true },
    ...initialColumns,
  ];

  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(defaultColumns.map((col) => col.key)));
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDragStart = (e: React.DragEvent, columnKey: string) => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnKey) return;

    const newColumns = [...columns];
    const draggedIndex = newColumns.findIndex((col) => col.key === draggedColumn);
    const targetIndex = newColumns.findIndex((col) => col.key === targetColumnKey);

    const [removed] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, removed);

    setColumns(newColumns);
    setDraggedColumn(null);
  };

  const handleFilterChange = (columnKey: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilter = (columnKey: string) => {
    setColumnFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });
  };

  const handleResizeStart = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    setResizingColumn(columnKey);
    setStartX(e.clientX);
    setStartWidth(columnWidths[columnKey] || 150);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn) {
        const diff = e.clientX - startX;
        const newWidth = Math.max(80, startWidth + diff);
        setColumnWidths((prev) => ({
          ...prev,
          [resizingColumn]: newWidth,
        }));
      }
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    if (resizingColumn) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, startX, startWidth]);

  const filteredData = data.filter((row) => {
    return Object.entries(columnFilters).every(([key, filterValue]) => {
      const cellValue = String(row[key] || '').toLowerCase();
      return cellValue.includes(filterValue.toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    const column = columns.find((col) => col.key === sortConfig.key);

    if (column?.type === 'number' || column?.type === 'currency') {
      const aNum = typeof aValue === 'number' ? aValue : Number.parseFloat(String(aValue).replace(/,/g, '')) || 0;
      const bNum = typeof bValue === 'number' ? bValue : Number.parseFloat(String(bValue).replace(/,/g, '')) || 0;
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
    }

    if (column?.type === 'date') {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      return sortConfig.direction === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const formatValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return '-';

    switch (type) {
      case 'date': {
        try {
          const date = typeof value === 'string' ? parseISO(value) : value;
          const expired = isBefore(date, new Date());
          return (
            <div className={cn('flex items-center gap-1.5', expired && 'text-red-600 dark:text-red-400')}>
              {expired && <AlertCircleIcon />}
              {formatDate(date)}
            </div>
          );
        } catch {
          return String(value);
        }
      }
      case 'currency':
        return new Intl.NumberFormat('es-ES').format(value);
      case 'status':
        return (
          <Badge
            className={cn(
              'text-xs opacity-100 shadow-md backdrop-blur-sm',
              value === 'Active' &&
                'border-green-200/50 bg-green-50/70 text-green-700 dark:border-green-800/50 dark:bg-green-950/70 dark:text-green-300',
              value === 'Pending' &&
                'border-yellow-200/50 bg-yellow-50/70 text-yellow-700 dark:border-yellow-800/50 dark:bg-yellow-950/70 dark:text-yellow-300',
              value === 'Inactive' &&
                'border-gray-200/50 bg-gray-50/70 text-gray-700 dark:border-gray-700/50 dark:bg-gray-900/70 dark:text-gray-300',
            )}
          >
            {value}
          </Badge>
        );
      default:
        return String(value);
    }
  };

  const visibleColumnsArray = columns.filter((col) => visibleColumns.has(col.key));

  const totals: Record<string, number> = {};
  columns.forEach((column) => {
    if (column.type === 'currency') {
      const total = sortedData.reduce((sum, row) => {
        const v = row[column.key];
        const num = typeof v === 'number' ? v : Number.parseFloat(String(v).replace(/,/g, '')) || 0;
        return sum + num;
      }, 0);
      totals[column.key] = total;
    }
  });

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns((prev) => {
      const s = new Set(prev);
      if (s.has(columnKey)) s.delete(columnKey); else s.add(columnKey);
      return s;
    });
  };

  const activeFiltersCount = Object.keys(columnFilters).length;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2 ml-auto">
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" onClick={onRefresh}>
                <RefreshCwIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Actualizar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" onClick={onDownload}>
                <DownloadIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Descargar Excel</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon">
                <ColumnsIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns
                .filter((col) => col.key !== 'actions')
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={visibleColumns.has(column.key)}
                    onCheckedChange={() => toggleColumnVisibility(column.key)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse" style={{ minWidth: 'max-content' }}>
          <thead className="sticky top-0 z-20 bg-[#1a2332] dark:bg-[#0f1a28]">
            <tr>
              {visibleColumnsArray.map((column) => (
                <th
                  key={column.key}
                  draggable={!column.fixed}
                  onDragStart={(e) => handleDragStart(e, column.key)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.key)}
                  className={cn(
                    'group relative border-b-2 border-border px-3 py-1.5 text-left text-xs font-medium uppercase tracking-wider text-gray-300 dark:text-gray-400',
                    column.fixed && 'sticky z-30 shadow-[2px_0_4px_rgba(0,0,0,0.05)]',
                    column.key === 'actions' && 'left-0 bg-[#1a2332] dark:bg-[#0f1a28]',
                    column.key === 'id' && 'left-[80px] border-r-2 bg-[#1a2332] dark:bg-[#0f1a28]',
                    draggedColumn === column.key && 'opacity-50',
                  )}
                  style={{
                    width: columnWidths[column.key] || (column.key === 'actions' ? 80 : 'auto'),
                    minWidth: column.key === 'actions' ? 80 : 80,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex-1">{column.label}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {column.sortable && (
                        <button onClick={() => handleSort(column.key)} className="rounded p-0.5 hover:bg-accent/50">
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                          ) : (
                            <ChevronUpIcon />
                          )}
                        </button>
                      )}
                      {column.filterable && (
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <button className="rounded p-0.5 hover:bg-accent/50">
                              <FilterIcon />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <div className="p-2">
                              <Input
                                placeholder={`Filtrar ${column.label}...`}
                                value={columnFilters[column.key] || ''}
                                onChange={(e) => handleFilterChange(column.key, (e.target as HTMLInputElement).value)}
                                className="h-8"
                              />
                              {columnFilters[column.key] && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => clearFilter(column.key)}
                                  className="mt-2 w-full"
                                >
                                  Limpiar filtro
                                </Button>
                              )}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      {column.key !== 'actions' && (
                        <button
                          onClick={() => toggleColumnVisibility(column.key)}
                          className="rounded p-0.5 hover:bg-accent/50"
                        >
                          <EyeOffIcon />
                        </button>
                      )}
                    </div>
                  </div>
                  {column.key !== 'actions' && (
                    <div
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50"
                      onMouseDown={(e) => handleResizeStart(e, column.key)}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => {
              const expired = row.date && isBefore(parseISO(row.date), new Date());
              return (
                <tr
                  key={rowIndex}
                  className={cn(
                    'border-b border-border transition-colors hover:bg-muted/50',
                    rowIndex % 2 === 0 ? 'bg-card' : 'bg-muted/20',
                  )}
                >
                  {visibleColumnsArray.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-3 py-1.5 text-sm',
                        column.fixed && 'sticky z-10',
                        column.key === 'actions' && 'left-0',
                        column.key === 'id' && 'left-[80px] border-r-2',
                        column.fixed && (rowIndex % 2 === 0 ? 'bg-card' : 'bg-neutral-100 dark:bg-neutral-800'),
                        column.type === 'currency' && 'text-right tabular-nums',
                        column.type === 'date' && expired && 'bg-red-50/50 dark:bg-red-950/20',
                      )}
                      style={{
                        width: columnWidths[column.key] || (column.key === 'actions' ? 80 : 'auto'),
                      }}
                    >
                      {column.key === 'actions' ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onQuickAction && onQuickAction(row)}
                            className="h-6 w-6"
                          >
                            <ZapIcon />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreVerticalIcon />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onView && onView(row)}>Ver</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onEdit && onEdit(row)}>Editar</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onDelete && onDelete(row)} className="text-destructive">
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ) : column.key === 'id' ? (
                        <div className="flex items-center gap-2">
                          {enableHyperlinks ? (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                onView && onView(row);
                              }}
                              className="flex-1 text-left font-bold hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300 text-blue-900"
                            >
                              {row[column.key]}
                            </a>
                          ) : (
                            <span className="flex-1">{row[column.key]}</span>
                          )}
                        </div>
                      ) : (
                        formatValue(row[column.key], column.type)
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="sticky bottom-0 z-20 bg-card shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
            <tr className="border-t-2 border-border">
              {visibleColumnsArray.map((column, index) => (
                <td
                  key={column.key}
                  className={cn(
                    'px-3 py-1.5 text-sm font-semibold',
                    column.fixed && 'sticky z-30 bg-card shadow-[2px_0_4px_rgba(0,0,0,0.05)]',
                    column.key === 'actions' && 'left-0',
                    column.key === 'id' && 'left-[80px] border-r-2',
                    column.type === 'currency' && 'text-right tabular-nums',
                  )}
                  style={{
                    width: columnWidths[column.key] || (column.key === 'actions' ? 80 : 'auto'),
                  }}
                >
                  {index === 1
                    ? 'Totales'
                    : column.type === 'currency'
                      ? new Intl.NumberFormat('es-ES').format(totals[column.key] || 0)
                      : ''}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 border-t border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filas por página:</span>
            <Select value={String(itemsPerPage)} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger className="h-8 w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20, 50, 100, 200].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, sortedData.length)} de {sortedData.length} registros
            {activeFiltersCount > 0 &&
              ` (${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} activo${activeFiltersCount > 1 ? 's' : ''})`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronLeftIcon />
          </Button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

EnterpriseDataGrid.displayName = 'EnterpriseDataGrid';

export default EnterpriseDataGrid;