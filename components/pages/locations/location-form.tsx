"use client";

import Heading from "@components/main/heading";
import ConfirmModal from "@components/modals/confirm-modal";
import { Button } from "@components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Separator } from "@components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentRole } from "@lib/hooks/client-auth";
import { LocationSchema } from "@lib/schemas";
import { cn, sortByProperty } from "@lib/utils";
import {
  Barangay,
  CityMunicipality,
  Province,
  Region,
  UserRole,
} from "@lib/utils/types";
import { Management } from "@prisma/client";
import axios from "axios";
import { Check, ChevronsUpDown, Trash } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface LocationFormProps {
  initialData?: Management | null;
  regions: Region[];
  provinces: Province[];
  cityMunicipalities: CityMunicipality[];
  barangays: Barangay[];
}

const LocationForm = ({
  initialData,
  regions,
  provinces,
  cityMunicipalities,
  barangays,
}: LocationFormProps) => {
  const role = useCurrentRole();
  const params = useParams();
  const router = useRouter();
  const pathName = usePathname();
  const locationId = pathName.split("/")[2];

  useEffect(() => {
    if (!initialData && locationId !== "new") {
      router.push("/locations/new");
    }

    if (initialData) {
      const filteredProvinces = provinces.filter(
        (x: Province) => x.regCode === initialData.regCode
      );
      const sortedProvinces = sortByProperty(
        filteredProvinces,
        "provDesc",
        "asc"
      );
      setSortedProvinces(sortedProvinces);

      const filteredCityMun = cityMunicipalities.filter(
        (x: CityMunicipality) => x.provCode === initialData.provCode
      );
      const sortedCityMun = sortByProperty(
        filteredCityMun,
        "citymunDesc",
        "asc"
      );
      setSortedCityMun(sortedCityMun);

      const filteredBarangay = barangays.filter(
        (x: Barangay) => x.citymunCode === initialData.citymunCode
      );
      const sortedBarangay = sortByProperty(
        filteredBarangay,
        "brgyDesc",
        "asc"
      );
      setSortedBarangay(sortedBarangay);
    }
  }, [
    barangays,
    cityMunicipalities,
    initialData,
    locationId,
    provinces,
    router,
  ]);

  const sortedRegions = sortByProperty(regions, "regDesc", "asc");
  const title = initialData ? "Edit location" : "Create location";
  const description = initialData ? "Edit a location" : "Add a new location";
  const action = initialData ? "Save changes" : "Create";

  const [openRegion, setOpenRegion] = useState(false);
  const [openProvince, setOpenProvince] = useState(false);
  const [openCitymun, setOpenCitymun] = useState(false);
  const [openBarangay, setOpenBarangay] = useState(false);

  const [sortedProvinces, setSortedProvinces] = useState<Province[]>([]);
  const [sortedCityMun, setSortedCityMun] = useState<CityMunicipality[]>([]);
  const [sortedBarangay, setSortedBarangay] = useState<Barangay[]>([]);

  const [loading, setLoading] = useState(false);

  const defaultValues = initialData
    ? {
        ...initialData,
      }
    : {
        email: "",
        name: "",
        regCode: "",
        provCode: "",
        citymunCode: "",
        brgyCode: "",
      };

  const form = useForm<z.infer<typeof LocationSchema>>({
    resolver: zodResolver(LocationSchema),
    defaultValues,
  });

  const onSubmit = async (data: z.infer<typeof LocationSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/locations/${params.locationId}`, data);
        toast.success("Location successfully updated.");

        router.push(`/locations`);
        router.refresh();
      } else {
        await axios.post(`/api/locations`, data);
        toast.success("Location successfully created.");

        router.push(`/locations`);
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/locations/${params.locationId}`);
      toast.success("Location successfully deleted.");

      router.push(`/locations`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onRegionSelect = (region: Region) => {
    form.setValue("regCode", region.regCode);
    form.setValue("provCode", "");
    form.setValue("citymunCode", "");
    form.setValue("brgyCode", "");

    setSortedProvinces(provinces.filter((x) => x.regCode === region.regCode));
    setSortedCityMun([]);
    setSortedBarangay([]);

    setOpenRegion(false);
  };

  const onProvinceSelect = (province: Province) => {
    form.setValue("provCode", province.provCode);
    form.setValue("citymunCode", "");
    form.setValue("brgyCode", "");

    setSortedCityMun(
      cityMunicipalities.filter((x) => x.provCode === province.provCode)
    );
    setSortedBarangay([]);

    setOpenProvince(false);
  };

  const onCityMunSelect = (cityMun: CityMunicipality) => {
    form.setValue("citymunCode", cityMun.citymunCode);
    form.setValue("brgyCode", "");

    setSortedBarangay(
      barangays.filter((x) => x.citymunCode === cityMun.citymunCode)
    );

    setOpenCitymun(false);
  };

  const onBarangaySelect = (barangay: Barangay) => {
    form.setValue("brgyCode", barangay.brgyCode);

    setOpenBarangay(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} subHeading></Heading>
        {initialData && role === UserRole.SUPER_ADMIN && (
          <ConfirmModal onConfirm={onDelete}>
            <Button disabled={loading} variant="destructive" size="sm">
              <Trash className="h-4 w-4" />
            </Button>
          </ConfirmModal>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          autoComplete="off"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid lg:grid-cols-4 md:grid-cols-2 gap-8 space-y-4 md:space-y-0">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Enter Name"
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!initialData && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter email"
                        type="email"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="md:grid lg:grid-cols-4 md:grid-cols-2 gap-8 space-y-4 md:space-y-0">
            <FormField
              control={form.control}
              name="regCode"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Region</FormLabel>
                  <Popover open={openRegion} onOpenChange={setOpenRegion}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={loading}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? regions.find(
                                (region) => region.regCode === field.value
                              )?.regDesc
                            : "Select region"}
                          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandList>
                          <CommandInput placeholder="Search region..." />
                          <CommandEmpty>No region found.</CommandEmpty>
                          <CommandGroup heading="Regions">
                            {sortedRegions.map((region) => (
                              <CommandItem
                                key={region.regCode}
                                onSelect={() => onRegionSelect(region)}
                                className={cn(
                                  "text-sm",
                                  region?.regCode === field.value
                                    ? "text-orange-600 bg-orange-400/20 hover:bg-orange-300/20 hover:text-orange-600"
                                    : ""
                                )}
                              >
                                {region.regDesc}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    region?.regCode === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provCode"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Province</FormLabel>
                  <Popover open={openProvince} onOpenChange={setOpenProvince}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={loading}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? provinces.find(
                                (province) => province.provCode === field.value
                              )?.provDesc
                            : "Select province"}
                          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandList>
                          <CommandInput placeholder="Search province..." />
                          <CommandEmpty>No province found.</CommandEmpty>
                          <CommandGroup
                            heading={
                              sortedProvinces.length === 0
                                ? "Select region first"
                                : "Provinces"
                            }
                          >
                            {sortedProvinces.map((province) => (
                              <CommandItem
                                key={province.provCode}
                                onSelect={() => onProvinceSelect(province)}
                                className={cn(
                                  "text-sm",
                                  province?.provCode === field.value
                                    ? "text-orange-600 bg-orange-400/20 hover:bg-orange-300/20 hover:text-orange-600"
                                    : ""
                                )}
                              >
                                {province.provDesc}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    province?.provCode === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="citymunCode"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>City/Municipality</FormLabel>
                  <Popover open={openCitymun} onOpenChange={setOpenCitymun}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={loading}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? cityMunicipalities.find(
                                (citymun) => citymun.citymunCode === field.value
                              )?.citymunDesc
                            : "Select city/municipality"}
                          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandList>
                          <CommandInput placeholder="Search city/municipality..." />
                          <CommandEmpty>
                            No city/municipality found.
                          </CommandEmpty>
                          <CommandGroup
                            heading={
                              sortedCityMun.length === 0
                                ? "Select province first"
                                : "City/Municipality"
                            }
                          >
                            {sortedCityMun.map((cityMun) => (
                              <CommandItem
                                key={cityMun.citymunCode}
                                onSelect={() => onCityMunSelect(cityMun)}
                                className={cn(
                                  "text-sm",
                                  cityMun.citymunCode === field.value
                                    ? "text-orange-600 bg-orange-400/20 hover:bg-orange-300/20 hover:text-orange-600"
                                    : ""
                                )}
                              >
                                {cityMun.citymunDesc}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    cityMun.citymunCode === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brgyCode"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Barangay</FormLabel>
                  <Popover open={openBarangay} onOpenChange={setOpenBarangay}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={loading}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? barangays.find(
                                (barangay) => barangay.brgyCode === field.value
                              )?.brgyDesc
                            : "Select barangay"}
                          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandList>
                          <CommandInput placeholder="Search barangay..." />
                          <CommandEmpty>No barangay found.</CommandEmpty>
                          <CommandGroup
                            heading={
                              sortedBarangay.length === 0
                                ? "Select city/municipality first"
                                : "Barangays"
                            }
                          >
                            {sortedBarangay.map((barangay) => (
                              <CommandItem
                                key={barangay.brgyCode}
                                onSelect={() => onBarangaySelect(barangay)}
                                className={cn(
                                  "text-sm",
                                  barangay.brgyCode === field.value
                                    ? "text-orange-600 bg-orange-400/20 hover:bg-orange-300/20 hover:text-orange-600"
                                    : "focus:bg-accent focus:text-accent-foreground"
                                )}
                              >
                                {barangay.brgyDesc}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    barangay.brgyCode === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LocationForm;
