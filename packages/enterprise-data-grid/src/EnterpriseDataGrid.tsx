import React, { forwardRef, useState, useMemo, useCallback } from 'react';

// Iconos SVG simples para reemplazar lucide-react
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18,15 12,9 6,15"></polyline>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7,10 12,15 17,10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

// Tipos e interfaces
export interface ColumnDefinition {
  key: string;
  header: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean';
  render?: (value: any, row: any) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  [key: string]: string;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

export interface EnterpriseDataGridProps {
  data: any[];
  columns: ColumnDefinition[];
  loading?: boolean;
  error?: string | null;
  pagination?: PaginationConfig;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  className?: string;
  onSort?: (sortConfig: SortConfig) => void;
  onFilter?: (filters: FilterConfig) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRowSelect?: (selectedRows: any[]) => void;
  onExport?: () => void;
}

// Función de formateo de fecha simple
const formatDate = (date: Date | string) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-ES');
};

// Función de formateo de número
const formatNumber = (value: number) => {
  if (typeof value !== 'number') return value;
  return value.toLocaleString('es-ES');
};

export const EnterpriseDataGrid = forwardRef<HTMLDivElement, EnterpriseDataGridProps>(({
  data = [],
  columns = [],
  loading = false,
  error = null,
  pagination,
  searchable = true,
  filterable = true,
  exportable = true,
  selectable = false,
  className = '',
  onSort,
  onFilter,
  onPageChange,
  onPageSizeChange,
  onRowSelect,
  onExport,
  ...props
}, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<FilterConfig>({});
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<{[key: string]: boolean}>(() => {
    const initial: {[key: string]: boolean} = {};
    columns.forEach(col => {
      initial[col.key] = true;
    });
    return initial;
  });

  // Filtrado y ordenamiento de datos
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Aplicar búsqueda global
    if (searchTerm && searchable) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Aplicar filtros por columna
    if (filterable) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filtered = filtered.filter(row =>
            String(row[key]).toLowerCase().includes(value.toLowerCase())
          );
        }
      });
    }

    // Aplicar ordenamiento
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, filters, sortConfig, searchable, filterable]);

  // Paginación
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, pagination]);

  // Manejo de ordenamiento
  const handleSort = useCallback((key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    const newSortConfig: SortConfig = {
      key,
      direction: sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    };

    setSortConfig(newSortConfig);
    onSort?.(newSortConfig);
  }, [columns, sortConfig, onSort]);

  // Manejo de filtros
  const handleFilter = useCallback((key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter?.(newFilters);
  }, [filters, onFilter]);

  // Manejo de selección
  const handleRowSelect = useCallback((index: number) => {
    if (!selectable) return;

    const newSelection = new Set(selectedRows);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }

    setSelectedRows(newSelection);
    const selectedData = Array.from(newSelection).map(idx => paginatedData[idx]);
    onRowSelect?.(selectedData);
  }, [selectable, selectedRows, paginatedData, onRowSelect]);

  // Seleccionar todos
  const handleSelectAll = useCallback(() => {
    if (!selectable) return;

    const allSelected = selectedRows.size === paginatedData.length;
    const newSelection = allSelected ? new Set<number>() : new Set(paginatedData.map((_, idx) => idx));
    
    setSelectedRows(newSelection);
    const selectedData = Array.from(newSelection).map(idx => paginatedData[idx]);
    onRowSelect?.(selectedData);
  }, [selectable, selectedRows, paginatedData, onRowSelect]);

  // Columnas visibles
  const visibleColumns = useMemo(() => {
    return columns.filter(col => columnVisibility[col.key]);
  }, [columns, columnVisibility]);

  const renderCellContent = useCallback((column: ColumnDefinition, value: any, row: any) => {
    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case 'date':
        return formatDate(value);
      case 'number':
        return formatNumber(value);
      case 'boolean':
        return value ? 'Sí' : 'No';
      default:
        return String(value || '');
    }
  }, []);

  if (error) {
    return (
      <div ref={ref} className={`p-4 border border-red-300 rounded-lg bg-red-50 ${className}`} {...props}>
        <div className="text-red-800">
          <h3 className="font-medium">Error al cargar los datos</h3>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} {...props}>
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            {searchable && (
              <div className="relative">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
              </div>
            )}
            
            {filterable && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''
                }`}
              >
                <FilterIcon />
                Filtros
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setColumnVisibility(prev => {
                const newState = { ...prev };
                const allVisible = Object.values(newState).every(v => v);
                columns.forEach(col => {
                  newState[col.key] = !allVisible;
                });
                return newState;
              })}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SettingsIcon />
              Columnas
            </button>
            
            {exportable && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <DownloadIcon />
                Exportar
              </button>
            )}
          </div>
        </div>

        {/* Filtros por columna */}
        {showFilters && filterable && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            {columns.filter(col => col.filterable).map(column => (
              <div key={column.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {column.header}
                </label>
                <input
                  type="text"
                  placeholder={`Filtrar ${column.header.toLowerCase()}...`}
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilter(column.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </th>
              )}
              {visibleColumns.map(column => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  style={{ width: column.width ? `${column.width}px` : 'auto' }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <div className="flex flex-col">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                        ) : (
                          <div className="w-4 h-4 opacity-30">
                            <ChevronUpIcon />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={visibleColumns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Cargando...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                  No se encontraron datos
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`hover:bg-gray-50 ${selectedRows.has(rowIndex) ? 'bg-blue-50' : ''}`}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleRowSelect(rowIndex)}
                        className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {visibleColumns.map(column => (
                    <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                      {renderCellContent(column, row[column.key], row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Mostrar</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>de {pagination.total} registros</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Anterior
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.pageSize)) }, (_, i) => {
                  const pageNum = pagination.page - 2 + i;
                  if (pageNum < 1 || pageNum > Math.ceil(pagination.total / pagination.pageSize)) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange?.(pageNum)}
                      className={`px-3 py-1 text-sm border rounded ${
                        pageNum === pagination.page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

EnterpriseDataGrid.displayName = 'EnterpriseDataGrid';

export default EnterpriseDataGrid;