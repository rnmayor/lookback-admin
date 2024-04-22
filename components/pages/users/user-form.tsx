"use client";

import Heading from "@components/main/heading";
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
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
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Separator } from "@components/ui/separator";
import { Switch } from "@components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "@lib/schemas";
import { cn, sortByProperty } from "@lib/utils";
import {
  Barangay,
  CityMunicipality,
  Gender,
  Province,
  Region,
} from "@lib/utils/types";
import { User, UserCovidStatus } from "@prisma/client";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface UserFormProps {
  initialData?:
    | (User & {
        userCovidStatus: UserCovidStatus | null;
      })
    | null;
  regions: Region[];
  provinces: Province[];
  cityMunicipalities: CityMunicipality[];
  barangays: Barangay[];
}

const UserForm = ({
  initialData,
  regions,
  provinces,
  cityMunicipalities,
  barangays,
}: UserFormProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const userId = pathName.split("/")[2];

  useEffect(() => {
    if (!initialData && userId !== "new") {
      router.push("/users/new");
    }

    if (initialData) {
      const sortedProvinces = sortByProperty(provinces, "provDesc", "asc");
      setSortedProvinces(sortedProvinces);

      const sortedCityMun = sortByProperty(
        cityMunicipalities,
        "citymunDesc",
        "asc"
      );
      setSortedCityMun(sortedCityMun);

      const sortedBarangay = sortByProperty(barangays, "brgyDesc", "asc");
      setSortedBarangay(sortedBarangay);
    }
  }, []);

  const sortedRegions = sortByProperty(regions, "regDesc", "asc");
  const title = initialData ? "Edit user" : "Create user";
  const description = initialData ? "Edit a user" : "Add a new user";
  const action = initialData ? "Save changes" : "Create";
  const covidStatus =
    initialData &&
    initialData.userCovidStatus &&
    initialData.userCovidStatus.status === "POSITIVE"
      ? true
      : false;
  const dob = initialData ? initialData.birthDate : undefined;

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
        covidStatus: covidStatus,
        dob: dob,
      }
    : {
        email: "",
        fname: "",
        lname: "",
        regCode: "",
        provCode: "",
        citymunCode: "",
        brgyCode: "",
        gender: "",
        // dob: undefined,
      };

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues,
  });

  const onSubmit = async (data: z.infer<typeof UserSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        // todo: update to DB
      } else {
        await axios.post(`/api/users`, data);
        router.refresh();
        router.push(`/users`);
        // TODO: toast success
        console.log("SUCCESS");
      }
    } catch (error) {
      // TODO: toast error
      console.log("error", error);
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

    setOpenRegion(false);
  };

  const onProvinceSelect = (province: Province) => {
    form.setValue("provCode", province.provCode);
    form.setValue("citymunCode", "");
    form.setValue("brgyCode", "");

    setSortedCityMun(
      cityMunicipalities.filter((x) => x.provCode === province.provCode)
    );

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

  const onCovidStatusChange = (value: boolean) => {
    form.setValue("covidStatus", !!value);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} subHeading />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => {}}
          >
            <Trash className="h-4 w-4" />
          </Button>
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
              name="fname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Enter First Name"
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Enter Last Name"
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
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col py-2.5">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        selected={field.value}
                        onSelect={field.onChange}
                        selectedDate={field.value}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                          <CommandGroup heading="Provinces">
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
                          <CommandGroup heading="City/Municipality">
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
                          <CommandGroup heading="Barangays">
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
          <div className="md:grid lg:grid-cols-4 md:grid-cols-2 gap-8 space-y-4 md:space-y-0">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "hover:bg-accent hover:text-accent-foreground",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value={Gender.FEMALE}
                        className={cn(
                          field.value === Gender.FEMALE
                            ? "text-orange-600 bg-orange-400/20 hover:bg-orange-300/20 hover:text-orange-600 focus:text-orange-600 focus:bg-orange-300/20"
                            : "focus:bg-accent focus:text-accent-foreground"
                        )}
                      >
                        Female
                      </SelectItem>
                      <SelectItem
                        value={Gender.MALE}
                        className={cn(
                          field.value === Gender.MALE
                            ? "text-orange-600 bg-orange-400/20 hover:bg-orange-300/20 hover:text-orange-600 focus:text-orange-600 focus:bg-orange-300/20"
                            : "focus:bg-accent focus:text-accent-foreground"
                        )}
                      >
                        Male
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="covidStatus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Covid Status</FormLabel>
                    <FormDescription>
                      Tag user as Covid 19 positive/negative
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={loading}
                      checked={field.value}
                      onCheckedChange={(value) => onCovidStatusChange(value)}
                    />
                  </FormControl>
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

export default UserForm;
