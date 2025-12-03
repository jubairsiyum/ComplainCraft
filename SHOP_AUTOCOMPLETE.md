# Shop Name Autocomplete Feature

## Overview
The Shop/Company Name field now features an intelligent autocomplete combobox that suggests previously complained shops while allowing users to enter new shop names.

## Features

### 1. **Autocomplete with Previous Complaints**
- Shows a dropdown list of shops that have been complained about before
- Displays complaint count next to each shop name (e.g., "Amana Big Bazar (3 complaints)")
- Sorted by number of complaints (most complained shops appear first)
- Limited to top 100 shops for performance

### 2. **Search Functionality**
- Type to search through existing shop names
- Real-time filtering as you type
- Case-insensitive search

### 3. **Custom Input Support**
- Users can type completely new shop names not in the list
- If no match is found, the typed value is automatically used
- Press Enter or click outside to confirm custom input

### 4. **Smart Data Management**
- New shop names are automatically saved when complaints are submitted
- Future complaints will show these shops in the dropdown
- Helps maintain consistency in shop naming across complaints

## Technical Implementation

### Components Created
- **`src/components/ui/combobox.tsx`**: Reusable combobox component
- **`src/components/ui/command.tsx`**: Command palette UI (from cmdk)
- **`src/components/ui/popover.tsx`**: Popover container for dropdown

### API Endpoint
- **`GET /api/shops`**: Fetches unique shop names with complaint counts
  - Uses MongoDB aggregation pipeline
  - Returns shop names sorted by complaint frequency
  - Response format:
    ```json
    {
      "success": true,
      "data": [
        {
          "shopName": "Amana Big Bazar",
          "complaintCount": 3
        }
      ]
    }
    ```

### Updated Files
- **`src/components/ComplaintForm.tsx`**: 
  - Replaced Input with Combobox component
  - Added useEffect to fetch shop options on mount
  - Shows loading state while fetching shops

## User Experience

### Scenario 1: Selecting Existing Shop
1. Click on the Shop/Company Name field
2. Dropdown shows previously complained shops
3. Click to select a shop or type to search
4. Selected shop name is filled in

### Scenario 2: Adding New Shop
1. Click on the Shop/Company Name field
2. Type the new shop name
3. If no match found, message shows: "Using: [shop name]"
4. Press Enter or click outside to confirm
5. New shop name is used for the complaint

### Scenario 3: Search and Select
1. Start typing in the field
2. List filters to matching shops
3. Click on a filtered result to select

## Benefits

1. **Data Consistency**: Reduces duplicate entries with different spellings
2. **User Convenience**: Quick selection of frequently complained shops
3. **Discovery**: Users can see which shops have multiple complaints
4. **Flexibility**: Still allows custom input for new shops
5. **Performance**: Aggregation pipeline efficiently queries MongoDB
6. **Scalability**: Limited to top 100 shops to prevent dropdown overload

## Dependencies Added
- `cmdk`: Command palette library for the autocomplete UI
- `@radix-ui/react-popover`: Popover component for dropdown positioning

## Future Enhancements
- Add shop address/location to help distinguish shops with similar names
- Show shop category/type in the dropdown
- Implement debouncing for search to reduce re-renders
- Add shop details preview on hover
- Allow administrators to merge duplicate shop entries
