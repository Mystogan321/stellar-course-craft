
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateBasicInfo } from '@/store/slices/courseFormSlice';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const PricingForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isPaid, price, discountPrice } = useAppSelector(state => state.courseForm);

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let numValue = parseFloat(value);
    
    // Validate the price is a positive number
    if (value === '' || isNaN(numValue)) {
      numValue = 0;
    } else if (numValue < 0) {
      numValue = 0;
    }
    
    dispatch(updateBasicInfo({ [name]: numValue }));
  };

  const handleToggleIsPaid = (checked: boolean) => {
    dispatch(updateBasicInfo({ isPaid: checked }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="isPaid" className="text-lg font-medium">Paid Course</Label>
          <p className="text-sm text-gray-500">Toggle to set your course as free or paid</p>
        </div>
        <Switch
          id="isPaid"
          checked={isPaid}
          onCheckedChange={handleToggleIsPaid}
        />
      </div>
      
      {isPaid && (
        <div className="space-y-6 border-t pt-6">
          <div>
            <Label htmlFor="price" className="text-lg font-medium">Price ($)</Label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={handlePricingChange}
                className="pl-8"
                placeholder="29.99"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="discountPrice" className="text-lg font-medium">Discount Price ($)</Label>
              <button
                type="button"
                onClick={() => dispatch(updateBasicInfo({ discountPrice: null }))}
                className="text-sm text-stellar-accent hover:underline"
              >
                Clear
              </button>
            </div>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <Input
                id="discountPrice"
                name="discountPrice"
                type="number"
                min="0"
                step="0.01"
                value={discountPrice || ''}
                onChange={handlePricingChange}
                className="pl-8"
                placeholder="19.99"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Leave empty if there's no discount</p>
          </div>
        </div>
      )}
      
      {!isPaid && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-green-800">Free Course</h3>
          <p className="text-green-600 mt-2">Your course will be available to students for free. This can be a great way to build your audience!</p>
        </div>
      )}
    </div>
  );
};

export default PricingForm;
