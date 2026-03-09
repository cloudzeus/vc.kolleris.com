'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CountryCombobox } from '@/components/ui/country-combobox';
import { DEFAULT_COUNTRY } from '@/lib/countries';

const companyFormSchema = z.object({
  COMPANY: z.string().min(1, 'Company code is required'),
  LOCKID: z.string().optional(),
  SODTYPE: z.string().optional(),
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  type: z.enum(['client', 'supplier'], {
    required_error: 'Please select a company type',
  }),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  website: z.string().optional().or(z.literal('')),
  logo: z.union([z.string(), z.any()]).optional(),
  // Additional ERP fields
  TRDR: z.string().optional(),
  CODE: z.string().optional(),
  AFM: z.string().optional(),
  IRSDATA: z.string().optional(),
  ZIP: z.string().optional(),
  PHONE01: z.string().optional(),
  PHONE02: z.string().optional(),
  JOBTYPE: z.string().optional(),
  EMAILACC: z.string().email('Invalid accounting email address').optional().or(z.literal('')),
  INSDATE: z.string().optional(),
  UPDDATE: z.string().optional(),
  default: z.boolean(),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  company?: {
    id: string;
    COMPANY?: string | null;
    LOCKID?: string | null;
    SODTYPE?: string | null;
    name: string;
    type: string;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    logo?: string | null;
    // Additional ERP fields
    TRDR?: string | null;
    CODE?: string | null;
    AFM?: string | null;
    IRSDATA?: string | null;
    ZIP?: string | null;
    PHONE01?: string | null;
    PHONE02?: string | null;
    JOBTYPE?: string | null;
    EMAILACC?: string | null;
    INSDATE?: string | null;
    UPDDATE?: string | null;
    default?: boolean | null;
  };
  onSubmit: (data: CompanyFormData & { logo?: any }) => Promise<void>;
  onCancel?: () => void;
}

export function CompanyForm({ company, onSubmit, onCancel }: CompanyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<any>(null);
  const [isVatLookingUp, setIsVatLookingUp] = useState(false);
  const { toast } = useToast();

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      COMPANY: company?.COMPANY || '',
      LOCKID: company?.LOCKID || '',
      SODTYPE: company?.SODTYPE || '',
      name: company?.name || '',
      type: (company?.type as 'client' | 'supplier') || 'client',
      address: company?.address || '',
      city: company?.city || '',
      country: company?.country || DEFAULT_COUNTRY,
      phone: company?.phone || '',
      email: company?.email || '',
      website: company?.website || '',
      logo: company?.logo || '',
      // Additional ERP fields
      TRDR: company?.TRDR || '',
      CODE: company?.CODE || '',
      AFM: company?.AFM || '',
      IRSDATA: company?.IRSDATA || '',
      ZIP: company?.ZIP || '',
      PHONE01: company?.PHONE01 || '',
      PHONE02: company?.PHONE02 || '',
      JOBTYPE: company?.JOBTYPE || '',
      EMAILACC: company?.EMAILACC || '',
      INSDATE: company?.INSDATE || '',
      UPDDATE: company?.UPDDATE || '',
      default: company?.default || false,
    },
  });

  const handleVatLookup = async () => {
    const vatNumber = form.getValues('AFM');

    if (!vatNumber || vatNumber.trim() === '') {
      toast({
        title: 'VAT Number Required',
        description: 'Please enter a VAT number before looking up company details.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsVatLookingUp(true);

      const response = await fetch('/api/companies/vat-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ AFM: vatNumber.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve company information');
      }

      const data = await response.json();

      console.log('VAT lookup response data:', data);

      // Update form fields with retrieved data
      const updatedValues = {
        COMPANY: vatNumber.trim(),
        IRSDATA: data.IRSDATA || '',
        JOBTYPE: data.JOBTYPE || '',
        name: data.name || '',
        address: data.address || '',
        ZIP: data.ZIP || '',
        city: data.city || '',
        country: 'Greece', // Set country to Greece for Greek companies
      };

      // Get current form values
      const currentValues = form.getValues();

      // Merge current values with updated values
      const mergedValues = { ...currentValues, ...updatedValues };

      // Reset form with merged values to ensure all fields update
      form.reset(mergedValues);

      // Force form to re-render and validate
      await form.trigger();

      console.log('Form values after update:', {
        COMPANY: form.getValues('COMPANY'),
        IRSDATA: form.getValues('IRSDATA'),
        JOBTYPE: form.getValues('JOBTYPE'),
        name: form.getValues('name'),
        address: form.getValues('address'),
        ZIP: form.getValues('ZIP'),
        city: form.getValues('city'),
        country: form.getValues('country'),
      });

      console.log('Updated values object:', updatedValues);

      toast({
        title: 'Company Information Retrieved',
        description: 'Company details have been automatically filled from the Greek government database.',
      });
    } catch (error) {
      console.error('VAT lookup error:', error);
      toast({
        title: 'Lookup Failed',
        description: 'Failed to retrieve company information. Please check the VAT number and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsVatLookingUp(false);
    }
  };

  const handleSubmit = async (data: CompanyFormData) => {
    try {
      setIsSubmitting(true)

      const formData = {
        ...data,
        SODTYPE: data.type === 'client' ? '13' : '12',
        LOCKID: '',
        email: data.email || '',
        website: data.website || '',
        EMAILACC: data.EMAILACC || '',
      }

      await onSubmit({ ...formData, logo: logoFile || undefined })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormError = () => {
    const errors = form.formState.errors
    if (Object.keys(errors).length > 0) {
      const errorFields = Object.keys(errors).join(', ')
      toast({
        title: 'Validation Error',
        description: `Please fix the following fields: ${errorFields}`,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="w-full h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit, handleFormError)} className="space-y-6 h-full">
          <Tabs defaultValue="basic" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-muted p-1 rounded-lg">
              <TabsTrigger
                value="basic"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                BASIC INFO
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                CONTACT & ADDRESS
              </TabsTrigger>
              <TabsTrigger
                value="erp"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                ERP DETAILS
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                ADVANCED
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="COMPANY"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">COMPANY CODE *</FormLabel>
                      <FormControl>
                        <Input placeholder="ENTER COMPANY CODE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">COMPANY NAME *</FormLabel>
                      <FormControl>
                        <Input placeholder="ENTER COMPANY NAME" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-semibold">COMPANY TYPE *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'client'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="SELECT COMPANY TYPE" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="client">CLIENT</SelectItem>
                        <SelectItem value="supplier">SUPPLIER</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="AFM"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">VAT NUMBER (AFM)</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="ENTER VAT NUMBER" {...field} />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleVatLookup}
                            disabled={isVatLookingUp}
                            className="shrink-0"
                          >
                            {isVatLookingUp ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Search className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="IRSDATA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">IRS TAX OFFICE</FormLabel>
                      <FormControl>
                        <Input placeholder="ENTER IRS TAX OFFICE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-semibold">ADDRESS</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ENTER COMPANY ADDRESS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">CITY</FormLabel>
                      <FormControl>
                        <Input placeholder="ENTER CITY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">COUNTRY</FormLabel>
                      <FormControl>
                        <CountryCombobox
                          value={field.value || DEFAULT_COUNTRY}
                          onChange={field.onChange}
                          placeholder="SELECT COUNTRY"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="PHONE01"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">PRIMARY PHONE</FormLabel>
                      <FormControl>
                        <Input placeholder="ENTER PRIMARY PHONE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="PHONE02"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">SECONDARY PHONE</FormLabel>
                      <FormControl>
                        <Input placeholder="ENTER SECONDARY PHONE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">EMAIL</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="ENTER EMAIL ADDRESS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="EMAILACC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">ACCOUNTING EMAIL</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="ENTER ACCOUNTING EMAIL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-semibold">WEBSITE</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="ENTER WEBSITE URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="erp" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="TRDR"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">TRDR (ERP ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="ENTER ERP ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="CODE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">ERP CODE</FormLabel>
                      <FormControl>
                        <Input placeholder="ENTER ERP CODE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ZIP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">ZIP CODE</FormLabel>
                      <FormControl>
                        <Input placeholder="ENTER ZIP CODE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="JOBTYPE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">JOB TYPE</FormLabel>
                      <FormControl>
                        <Input placeholder="ENTER JOB TYPE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="INSDATE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">INSERT DATE</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="UPDDATE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-semibold">UPDATE DATE</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-semibold">COMPANY LOGO</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // Handle file upload logic here
                          field.onChange(file.name)
                        }
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="default"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base uppercase font-semibold">DEFAULT COMPANY</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Set this company as the default company for the system
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                CANCEL
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {company ? 'UPDATE COMPANY' : 'CREATE COMPANY'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 