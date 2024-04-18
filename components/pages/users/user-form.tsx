"use client";

import Heading from "@components/main/heading";
import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Separator } from "@components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "@lib/schemas";
import { Region } from "@lib/utils/types";
import { User } from "@prisma/client";
import { Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface UserFormProps {
  initialData?: User | null;
  regions: Region[];
}

const UserForm = ({ initialData, regions }: UserFormProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const userId = pathName.split("/")[2];

  console.log("initialData", initialData);

  useEffect(() => {
    if (!initialData && userId !== "new") {
      router.push("/users/new");
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const title = initialData ? "Edit user" : "Create user";
  const description = initialData ? "Edit a user" : "Add a new user";
  const action = initialData ? "Save changes" : "Create";
  // const defaultRegion = initialData ? regions.find(x => x.regCode === initialData.regCode) : ''

  const defaultValues = initialData
    ? {
        ...initialData,
      }
    : {
        fname: "",
        lname: "",
        regCode: "",
        provCode: "",
        citymunCode: "",
        brgyCode: "",
        gender: "",
        covidStatus: "",
      };

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues,
  });

  const onSubmit = () => {
    // TODO: save to db
  };

  const getDefaultRegion = (regCode: string): Region | undefined => {
    const defaultRegion = regions.find((x) => x.regCode === regCode);
    return defaultRegion;
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
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-2 gap-8 space-y-4 md:space-y-0">
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
                </FormItem>
              )}
            />
          </div>
          <div className="md:grid lg:grid-cols-4 md:grid-cols-2 gap-8 space-y-4 md:space-y-0">
            <FormField
              control={form.control}
              name="regCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.regCode} value={region.regCode}>
                          {region.regDesc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select province..."
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.regCode} value={region.regCode}>
                          {region.regDesc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="citymunCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/Municipality</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Choose region"
                    ></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brgyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barangay</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Choose region"
                    ></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Choose region"
                    ></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="covidStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Covid Status</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Choose region"
                      value={field.value !== null ? field.value : undefined}
                    ></Input>
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
