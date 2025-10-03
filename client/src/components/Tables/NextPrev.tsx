import React from "react";

const NextPrev = () => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Rows per page:</span>
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => {
            table.setPageIndex(0); // reset page so you don't land on an empty page
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-[120px] border-accent">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                Show {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  );
};

export default NextPrev;
