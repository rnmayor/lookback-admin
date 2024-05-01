"use client";

import Heading from "@components/main/heading";
import ConfirmModal from "@components/modals/confirm-modal";
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
import {
  getBarangaysByCitymunCode,
  getCityMunicipalitiesByProvCode,
  getProvincesByRegCode,
} from "@lib/data/location";
import { useCurrentRole } from "@lib/hooks/client-auth";
import { UserSchema } from "@lib/schemas";
import { cn, sortByProperty } from "@lib/utils";
import {
  Barangay,
  CityMunicipality,
  Gender,
  Province,
  Region,
  UserRole,
} from "@lib/utils/types";
import { User, UserCovidStatus } from "@prisma/client";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Trash } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface UserFormProps {
  initialData?:
    | (User & {
        userCovidStatus: UserCovidStatus | null;
      })
    | null;
  regions: Region[];
}

const UserForm = ({ initialData, regions }: UserFormProps) => {
  const role = useCurrentRole();
  const params = useParams();
  const router = useRouter();
  const pathName = usePathname();
  const userId = pathName.split("/")[2];

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cityMun, setCityMun] = useState<CityMunicipality[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);

  useEffect(() => {
    if (!initialData && userId !== "new") {
      router.push("/users/new");
    }

    if (initialData) {
      const fetchProvinces = async () => {
        const sortedProvinces = sortByProperty<Province>(
          await getProvincesByRegCode(initialData.regCode),
          "provDesc",
          "asc"
        );
        setProvinces(sortedProvinces);
      };

      const fetchCityMunicipalities = async () => {
        const sortedCityMun = sortByProperty<CityMunicipality>(
          await getCityMunicipalitiesByProvCode(initialData.provCode),
          "citymunDesc",
          "asc"
        );
        setCityMun(sortedCityMun);
      };

      const fetchBarangays = async () => {
        const sortedBarangay = sortByProperty<Barangay>(
          await getBarangaysByCitymunCode(initialData.citymunCode),
          "brgyDesc",
          "asc"
        );
        setBarangays(sortedBarangay);
      };

      fetchProvinces();
      fetchCityMunicipalities();
      fetchBarangays();
    }
  }, [initialData, userId, router]);

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
      };

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues,
  });

  const onSubmit = async (data: z.infer<typeof UserSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/users/${params.userId}`, data);
        toast.success("User successfully updated.");

        router.push(`/users`);
        router.refresh();
      } else {
        await axios.post(`/api/users`, data);
        toast.success("User successfully created.");

        router.push(`/users`);
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
      await axios.delete(`/api/users/${params.userId}`);
      toast.success("User successfully deleted.");

      router.push(`/users`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onRegionSelect = async (region: Region) => {
    form.setValue("regCode", region.regCode);
    form.setValue("provCode", "");
    form.setValue("citymunCode", "");
    form.setValue("brgyCode", "");

    const sortedProvinces = sortByProperty<Province>(
      await getProvincesByRegCode(region.regCode),
      "provDesc",
      "asc"
    );
    setProvinces(sortedProvinces);
    setCityMun([]);
    setBarangays([]);

    setOpenRegion(false);
  };

  const onProvinceSelect = async (province: Province) => {
    form.setValue("provCode", province.provCode);
    form.setValue("citymunCode", "");
    form.setValue("brgyCode", "");

    const sortedCityMun = sortByProperty<CityMunicipality>(
      await getCityMunicipalitiesByProvCode(province.provCode),
      "citymunDesc",
      "asc"
    );
    setCityMun(sortedCityMun);
    setBarangays([]);

    setOpenProvince(false);
  };

  const onCityMunSelect = async (cityMun: CityMunicipality) => {
    form.setValue("citymunCode", cityMun.citymunCode);
    form.setValue("brgyCode", "");

    const sortedBarangay = sortByProperty<Barangay>(
      await getBarangaysByCitymunCode(cityMun.citymunCode),
      "brgyDesc",
      "asc"
    );
    setBarangays(sortedBarangay);

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
                          {field.value ? (
                            <span className="truncate">
                              {
                                regions.find(
                                  (region) => region.regCode === field.value
                                )?.regDesc
                              }
                            </span>
                          ) : (
                            <span>{"Select region"}</span>
                          )}
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
                                    ? "text-accent bg-primary"
                                    : ""
                                )}
                              >
                                {region.regDesc}
                                <Check
                                  className={cn(
                                    "ml-auto h-5 w-5",
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
                          {field.value ? (
                            <span className="truncate">
                              {
                                provinces.find(
                                  (province) =>
                                    province.provCode === field.value
                                )?.provDesc
                              }
                            </span>
                          ) : (
                            <span>{"Select province"}</span>
                          )}
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
                              provinces.length === 0
                                ? "Select region first"
                                : "Provinces"
                            }
                          >
                            {provinces.map((province) => (
                              <CommandItem
                                key={province.provCode}
                                onSelect={() => onProvinceSelect(province)}
                                className={cn(
                                  "text-sm",
                                  province?.provCode === field.value
                                    ? "text-accent bg-primary"
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
                          {field.value ? (
                            <span className="truncate">
                              {
                                cityMun.find(
                                  (citymun) =>
                                    citymun.citymunCode === field.value
                                )?.citymunDesc
                              }
                            </span>
                          ) : (
                            <span>{"Select city/municipality"}</span>
                          )}
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
                              cityMun.length === 0
                                ? "Select province first"
                                : "City/Municipality"
                            }
                          >
                            {cityMun.map((cityMun) => (
                              <CommandItem
                                key={cityMun.citymunCode}
                                onSelect={() => onCityMunSelect(cityMun)}
                                className={cn(
                                  "text-sm",
                                  cityMun.citymunCode === field.value
                                    ? "text-accent bg-primary"
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
                          {field.value ? (
                            <span className="truncate">
                              {
                                barangays.find(
                                  (barangay) =>
                                    barangay.brgyCode === field.value
                                )?.brgyDesc
                              }
                            </span>
                          ) : (
                            <span>{"Select barangay"}</span>
                          )}
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
                              barangays.length === 0
                                ? "Select city/municipality first"
                                : "Barangays"
                            }
                          >
                            {barangays.map((barangay) => (
                              <CommandItem
                                key={barangay.brgyCode}
                                onSelect={() => onBarangaySelect(barangay)}
                                className={cn(
                                  "text-sm",
                                  barangay.brgyCode === field.value
                                    ? "text-accent bg-primary"
                                    : ""
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
                            ? "text-accent bg-primary"
                            : ""
                        )}
                      >
                        Female
                      </SelectItem>
                      <SelectItem
                        value={Gender.MALE}
                        className={cn(
                          field.value === Gender.MALE
                            ? "text-accent bg-primary"
                            : ""
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
